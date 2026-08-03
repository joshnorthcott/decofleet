using Decofleet.Application.Common.Models;
using Decofleet.Application.Features.Conductores.Dtos;
using Decofleet.Domain.Conductores.Enums;
using MediatR;

namespace Decofleet.Application.Features.Conductores.Queries.GetConductores;

public sealed record GetConductoresQuery(
    int Page = 1,
    int PageSize = 20,
    string? Search = null,
    EEstatusConductor? Estatus = null
) : IRequest<PagedResult<ConductorDto>>;
