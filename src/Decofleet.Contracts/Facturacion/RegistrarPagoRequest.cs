using Decofleet.Domain.Contratos.Enums;

namespace Decofleet.Contracts.Facturacion;

public sealed record RegistrarPagoRequest(
    Guid PagoContratoId,
    decimal Monto,
    EFormaPago FormaPago,
    DateTimeOffset FechaPago,
    string? Referencia
);
