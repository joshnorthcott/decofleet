using Decofleet.Domain.Vehiculos.Enums;

namespace Decofleet.Application.Features.Vehiculos.Dtos;

public sealed record VehiculoDto(
    Guid Id,
    Guid EmpresaId,
    string Marca,
    string Modelo,
    int Anio,
    string? Placas,
    string? Vin,
    string? Color,
    EEstatusVehiculo Estatus,
    string? Telefono,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt
);
