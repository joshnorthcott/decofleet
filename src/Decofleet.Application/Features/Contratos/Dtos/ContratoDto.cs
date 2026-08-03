using Decofleet.Domain.Contratos.Enums;

namespace Decofleet.Application.Features.Contratos.Dtos;

public sealed record ContratoDto(
    Guid Id,
    Guid EmpresaId,
    Guid ConductorId,
    string NombreConductor,
    Guid VehiculoId,
    string DescripcionVehiculo,
    Guid TarifaId,
    string NombreTarifa,
    decimal MontoRenta,
    EPeriodicidad Periodicidad,
    DateOnly FechaInicio,
    DateOnly? FechaFin,
    EEstatusContrato Estatus,
    EFormaPago FormaPago,
    string? Observaciones,
    DateTimeOffset CreatedAt
);
