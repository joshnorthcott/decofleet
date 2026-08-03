using Decofleet.Application.Features.Vehiculos.Dtos;
using Decofleet.Domain.Vehiculos.Enums;
using MediatR;

namespace Decofleet.Application.Features.Vehiculos.Commands.UpdateVehiculo;

public sealed record UpdateVehiculoCommand(
    Guid Id,
    string Marca,
    string Modelo,
    int Anio,
    string? Placas,
    string? Vin,
    string? Color,
    string? Telefono,
    EEstatusVehiculo Estatus
) : IRequest<VehiculoDto>;
