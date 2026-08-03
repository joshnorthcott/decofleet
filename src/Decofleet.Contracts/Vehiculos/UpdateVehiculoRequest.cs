using Decofleet.Domain.Vehiculos.Enums;

namespace Decofleet.Contracts.Vehiculos;

public sealed record UpdateVehiculoRequest(
    string Marca,
    string Modelo,
    int Anio,
    string? Placas,
    string? Vin,
    string? Color,
    string? Telefono,
    EEstatusVehiculo Estatus
);
