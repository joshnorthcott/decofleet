using Decofleet.Application.Features.Vehiculos.Dtos;
using MediatR;

namespace Decofleet.Application.Features.Vehiculos.Commands.CreateVehiculo;

public sealed record CreateVehiculoCommand(
    string Marca,
    string Modelo,
    int Anio,
    string? Placas,
    string? Vin,
    string? Color,
    string? Telefono
) : IRequest<VehiculoDto>;
