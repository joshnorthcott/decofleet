using Carter;
using Decofleet.Application.Features.Facturacion.Commands.RegistrarPago;
using Decofleet.Application.Features.Facturacion.Dtos;
using Decofleet.Application.Features.Facturacion.Queries.GetPagosContrato;
using Decofleet.Application.Common.Models;
using Decofleet.Contracts.Facturacion;
using Decofleet.Domain.Facturacion.Enums;
using MediatR;

namespace Decofleet.Api.Modules;

public sealed class FacturacionModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/pagos")
            .WithTags("Facturacion")
            .RequireAuthorization();

        group.MapGet("", GetPagos)
            .WithSummary("List payment periods with computed paid/pending amounts.")
            .Produces<PagedResult<PagoContratoDto>>();

        group.MapPost("", RegistrarPago)
            .WithSummary("Record a payment against a payment period. Validates against overpayment.")
            .Produces<PagoEmitidoDto>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status422UnprocessableEntity);
    }

    private static async Task<IResult> GetPagos(
        ISender sender,
        CancellationToken ct,
        Guid? contratoId = null,
        EEstatusPago? estatus = null,
        int page = 1,
        int pageSize = 20)
        => Results.Ok(await sender.Send(new GetPagosContratoQuery(contratoId, estatus, page, pageSize), ct));

    private static async Task<IResult> RegistrarPago(
        RegistrarPagoRequest request, ISender sender, CancellationToken ct)
    {
        var result = await sender.Send(new RegistrarPagoCommand(
            request.PagoContratoId, request.Monto, request.FormaPago,
            request.FechaPago, request.Referencia), ct);

        return Results.Created($"/api/pagos/{result.Id}", result);
    }
}
