using Carter;
using Decofleet.Application.Features.Contratos.Commands.ActualizarEstatusContrato;
using Decofleet.Application.Features.Contratos.Commands.CreateContrato;
using Decofleet.Application.Features.Contratos.Dtos;
using Decofleet.Application.Features.Contratos.Queries.GetContratoById;
using Decofleet.Application.Features.Contratos.Queries.GetContratos;
using Decofleet.Application.Common.Models;
using Decofleet.Contracts.Contratos;
using Decofleet.Domain.Contratos.Enums;
using MediatR;

namespace Decofleet.Api.Modules;

public sealed class ContratosModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/contratos")
            .WithTags("Contratos")
            .RequireAuthorization();

        group.MapGet("", GetAll)
            .WithSummary("List contratos with optional filters.")
            .Produces<PagedResult<ContratoDto>>();

        group.MapGet("{id:guid}", GetById)
            .WithSummary("Get a single contrato by ID.")
            .Produces<ContratoDto>()
            .Produces(StatusCodes.Status404NotFound);

        group.MapPost("", Create)
            .WithSummary("Create a new contrato. Validates vehicle availability and marks it as Arrendado.")
            .Produces<ContratoDto>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status422UnprocessableEntity);

        group.MapPatch("{id:guid}/estatus", ActualizarEstatus)
            .WithSummary("Update contrato status. Finalizado/Cancelado releases the vehicle back to Disponible.")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status422UnprocessableEntity);
    }

    private static async Task<IResult> GetAll(
        ISender sender,
        CancellationToken ct,
        int page = 1,
        int pageSize = 20,
        EEstatusContrato? estatus = null,
        Guid? conductorId = null,
        Guid? vehiculoId = null)
        => Results.Ok(await sender.Send(
            new GetContratosQuery(page, pageSize, estatus, conductorId, vehiculoId), ct));

    private static async Task<IResult> GetById(Guid id, ISender sender, CancellationToken ct)
        => Results.Ok(await sender.Send(new GetContratoByIdQuery(id), ct));

    private static async Task<IResult> Create(
        CreateContratoRequest request, ISender sender, CancellationToken ct)
    {
        var result = await sender.Send(new CreateContratoCommand(
            request.ConductorId, request.VehiculoId, request.TarifaId,
            request.FechaInicio, request.FechaFin,
            request.FormaPago, request.Observaciones), ct);

        return Results.Created($"/api/contratos/{result.Id}", result);
    }

    private static async Task<IResult> ActualizarEstatus(
        Guid id, ActualizarEstatusContratoRequest request, ISender sender, CancellationToken ct)
    {
        await sender.Send(new ActualizarEstatusContratoCommand(id, request.NuevoEstatus), ct);
        return Results.NoContent();
    }
}
