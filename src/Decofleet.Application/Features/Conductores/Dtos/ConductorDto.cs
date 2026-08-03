using Decofleet.Domain.Conductores.Enums;

namespace Decofleet.Application.Features.Conductores.Dtos;

public sealed record ConductorDto(
    Guid Id,
    Guid EmpresaId,
    string Nombre,
    string ApellidoPaterno,
    string? ApellidoMaterno,
    string NombreCompleto,
    string? Curp,
    string? Telefono,
    string? Email,
    string? Direccion,
    string? CodigoPostal,
    EEstatusConductor Estatus,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt
);
