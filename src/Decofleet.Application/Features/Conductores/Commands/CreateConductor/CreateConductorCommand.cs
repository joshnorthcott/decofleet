using Decofleet.Application.Features.Conductores.Dtos;
using Decofleet.Domain.Conductores.Enums;
using MediatR;

namespace Decofleet.Application.Features.Conductores.Commands.CreateConductor;

public sealed record CreateConductorCommand(
    string Nombre,
    string ApellidoPaterno,
    string? ApellidoMaterno,
    string? Curp,
    string? Telefono,
    string? Email,
    string? Direccion,
    string? CodigoPostal
) : IRequest<ConductorDto>;
