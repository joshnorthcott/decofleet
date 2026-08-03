using Decofleet.Application.Common.Models;
using Decofleet.Application.Features.Contratos.Dtos;
using Decofleet.Domain.Contratos.Enums;
using MediatR;

namespace Decofleet.Application.Features.Contratos.Queries.GetContratos;

public sealed record GetContratosQuery(
    int Page = 1,
    int PageSize = 20,
    EEstatusContrato? Estatus = null,
    Guid? ConductorId = null,
    Guid? VehiculoId = null
) : IRequest<PagedResult<ContratoDto>>;
