using Decofleet.Application.Features.Facturacion.Dtos;
using Decofleet.Domain.Contratos.Enums;
using MediatR;

namespace Decofleet.Application.Features.Facturacion.Commands.RegistrarPago;

public sealed record RegistrarPagoCommand(
    Guid PagoContratoId,
    decimal Monto,
    EFormaPago FormaPago,
    DateTimeOffset FechaPago,
    string? Referencia
) : IRequest<PagoEmitidoDto>;
