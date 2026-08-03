using Decofleet.Application.Features.Contratos.Dtos;
using MediatR;

namespace Decofleet.Application.Features.Contratos.Queries.GetContratoById;

public sealed record GetContratoByIdQuery(Guid Id) : IRequest<ContratoDto>;
