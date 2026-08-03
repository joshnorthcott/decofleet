using Decofleet.Application.Features.Vehiculos.Dtos;
using MediatR;

namespace Decofleet.Application.Features.Vehiculos.Queries.GetVehiculoById;

public sealed record GetVehiculoByIdQuery(Guid Id) : IRequest<VehiculoDto>;
