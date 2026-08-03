using Carter;
using Decofleet.Application.Features.Vehiculos.Commands.CreateVehiculo;
using Decofleet.Application.Features.Vehiculos.Commands.UpdateVehiculo;
using Decofleet.Application.Features.Vehiculos.Dtos;
using Decofleet.Application.Features.Vehiculos.Queries.GetVehiculoById;
using Decofleet.Application.Features.Vehiculos.Queries.GetVehiculos;
using Decofleet.Application.Common.Models;
using Decofleet.Contracts.Vehiculos;
using Decofleet.Domain.Vehiculos.Enums;
using MediatR;

namespace Decofleet.Api.Modules;

public sealed class VehiculosModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/vehiculos")
            .WithTags("Vehiculos")
            .RequireAuthorization();

        group.MapGet("", GetAll)
            .WithSummary("List vehiculos with optional search and status filter.")
            .Produces<PagedResult<VehiculoDto>>();

        group.MapGet("{id:guid}", GetById)
            .WithSummary("Get a single vehiculo by ID.")
            .Produces<VehiculoDto>()
            .Produces(StatusCodes.Status404NotFound);

        group.MapPost("", Create)
            .WithSummary("Register a new vehiculo.")
            .Produces<VehiculoDto>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status422UnprocessableEntity);

        group.MapPut("{id:guid}", Update)
            .WithSummary("Update vehiculo details or status.")
            .Produces<VehiculoDto>()
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status422UnprocessableEntity);
    }

    private static async Task<IResult> GetAll(
        ISender sender,
        CancellationToken ct,
        int page = 1,
        int pageSize = 20,
        string? search = null,
        EEstatusVehiculo? estatus = null)
        => Results.Ok(await sender.Send(new GetVehiculosQuery(page, pageSize, search, estatus), ct));

    private static async Task<IResult> GetById(Guid id, ISender sender, CancellationToken ct)
        => Results.Ok(await sender.Send(new GetVehiculoByIdQuery(id), ct));

    private static async Task<IResult> Create(
        CreateVehiculoRequest request, ISender sender, CancellationToken ct)
    {
        var result = await sender.Send(new CreateVehiculoCommand(
            request.Marca, request.Modelo, request.Anio,
            request.Placas, request.Vin, request.Color, request.Telefono), ct);

        return Results.Created($"/api/vehiculos/{result.Id}", result);
    }

    private static async Task<IResult> Update(
        Guid id, UpdateVehiculoRequest request, ISender sender, CancellationToken ct)
    {
        var result = await sender.Send(new UpdateVehiculoCommand(
            id, request.Marca, request.Modelo, request.Anio,
            request.Placas, request.Vin, request.Color, request.Telefono, request.Estatus), ct);

        return Results.Ok(result);
    }
}
