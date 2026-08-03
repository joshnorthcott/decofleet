using Decofleet.Application.Features.Conductores.Dtos;
using Decofleet.Domain.Conductores.Enums;
using MediatR;

namespace Decofleet.Application.Features.Conductores.Commands.UpdateConductor;

public sealed record UpdateConductorCommand(
    Guid Id,
    string Nombre,
    string ApellidoPaterno,
    string? ApellidoMaterno,
    string? Curp,
    string? Telefono,
    string? Email,
    string? Direccion,
    string? CodigoPostal,
    EEstatusConductor Estatus
) : IRequest<ConductorDto>;
