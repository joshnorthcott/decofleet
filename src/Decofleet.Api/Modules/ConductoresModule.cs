using Carter;
using Decofleet.Application.Features.Conductores.Commands.CreateConductor;
using Decofleet.Application.Features.Conductores.Commands.DeleteConductor;
using Decofleet.Application.Features.Conductores.Commands.UpdateConductor;
using Decofleet.Application.Features.Conductores.Dtos;
using Decofleet.Application.Features.Conductores.Queries.GetConductorById;
using Decofleet.Application.Features.Conductores.Queries.GetConductores;
using Decofleet.Application.Common.Models;
using Decofleet.Contracts.Conductores;
using Decofleet.Domain.Conductores.Enums;
using MediatR;

namespace Decofleet.Api.Modules;

public sealed class ConductoresModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/conductores")
            .WithTags("Conductores")
            .RequireAuthorization();

        group.MapGet("", GetAll)
            .WithSummary("List conductores with optional search and status filter.")
            .Produces<PagedResult<ConductorDto>>();

        group.MapGet("{id:guid}", GetById)
            .WithSummary("Get a single conductor by ID.")
            .Produces<ConductorDto>()
            .Produces(StatusCodes.Status404NotFound);

        group.MapPost("", Create)
            .WithSummary("Create a new conductor.")
            .Produces<ConductorDto>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status422UnprocessableEntity);

        group.MapPut("{id:guid}", Update)
            .WithSummary("Update conductor details.")
            .Produces<ConductorDto>()
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status422UnprocessableEntity);

        group.MapDelete("{id:guid}", Delete)
            .WithSummary("Soft-delete a conductor.")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);
    }

    private static async Task<IResult> GetAll(
        ISender sender,
        CancellationToken ct,
        int page = 1,
        int pageSize = 20,
        string? search = null,
        EEstatusConductor? estatus = null)
        => Results.Ok(await sender.Send(new GetConductoresQuery(page, pageSize, search, estatus), ct));

    private static async Task<IResult> GetById(Guid id, ISender sender, CancellationToken ct)
        => Results.Ok(await sender.Send(new GetConductorByIdQuery(id), ct));

    private static async Task<IResult> Create(
        CreateConductorRequest request, ISender sender, CancellationToken ct)
    {
        var result = await sender.Send(new CreateConductorCommand(
            request.Nombre, request.ApellidoPaterno, request.ApellidoMaterno,
            request.Curp, request.Telefono, request.Email,
            request.Direccion, request.CodigoPostal), ct);

        return Results.Created($"/api/conductores/{result.Id}", result);
    }

    private static async Task<IResult> Update(
        Guid id, UpdateConductorRequest request, ISender sender, CancellationToken ct)
    {
        var result = await sender.Send(new UpdateConductorCommand(
            id, request.Nombre, request.ApellidoPaterno, request.ApellidoMaterno,
            request.Curp, request.Telefono, request.Email,
            request.Direccion, request.CodigoPostal, request.Estatus), ct);

        return Results.Ok(result);
    }

    private static async Task<IResult> Delete(Guid id, ISender sender, CancellationToken ct)
    {
        await sender.Send(new DeleteConductorCommand(id), ct);
        return Results.NoContent();
    }
}
