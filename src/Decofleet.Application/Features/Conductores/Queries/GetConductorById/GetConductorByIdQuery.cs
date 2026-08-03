using Decofleet.Application.Features.Conductores.Dtos;
using MediatR;

namespace Decofleet.Application.Features.Conductores.Queries.GetConductorById;

public sealed record GetConductorByIdQuery(Guid Id) : IRequest<ConductorDto>;
