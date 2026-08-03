using Decofleet.Domain.Facturacion.Enums;

namespace Decofleet.Application.Features.Facturacion.Dtos;

public sealed record PagoContratoDto(
    Guid Id,
    Guid ContratoId,
    Guid EmpresaId,
    DateOnly PeriodoInicio,
    DateOnly PeriodoFin,
    decimal MontoTotal,
    decimal MontoPagado,
    decimal SaldoPendiente,
    EEstatusPago Estatus,
    DateOnly? FechaVencimiento,
    DateTimeOffset CreatedAt
);

public sealed record PagoEmitidoDto(
    Guid Id,
    Guid PagoContratoId,
    decimal Monto,
    string FormaPago,
    DateTimeOffset FechaPago,
    string? Referencia
);
