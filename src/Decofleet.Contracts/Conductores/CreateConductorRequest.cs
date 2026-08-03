namespace Decofleet.Contracts.Conductores;

public sealed record CreateConductorRequest(
    string Nombre,
    string ApellidoPaterno,
    string? ApellidoMaterno,
    string? Curp,
    string? Telefono,
    string? Email,
    string? Direccion,
    string? CodigoPostal
);
