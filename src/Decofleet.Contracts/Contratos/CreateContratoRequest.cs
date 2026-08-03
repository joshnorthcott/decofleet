using Decofleet.Domain.Contratos.Enums;

namespace Decofleet.Contracts.Contratos;

public sealed record CreateContratoRequest(
    Guid ConductorId,
    Guid VehiculoId,
    Guid TarifaId,
    DateOnly FechaInicio,
    DateOnly? FechaFin,
    EFormaPago FormaPago,
    string? Observaciones
);
