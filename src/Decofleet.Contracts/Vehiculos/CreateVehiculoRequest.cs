namespace Decofleet.Contracts.Vehiculos;

public sealed record CreateVehiculoRequest(
    string Marca,
    string Modelo,
    int Anio,
    string? Placas,
    string? Vin,
    string? Color,
    string? Telefono
);
