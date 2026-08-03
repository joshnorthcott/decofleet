using Decofleet.Domain.Conductores.Enums;

namespace Decofleet.Contracts.Conductores;

public sealed record UpdateConductorRequest(
    string Nombre,
    string ApellidoPaterno,
    string? ApellidoMaterno,
    string? Curp,
    string? Telefono,
    string? Email,
    string? Direccion,
    string? CodigoPostal,
    EEstatusConductor Estatus
);
