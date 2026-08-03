using Decofleet.Application.Common.Models;
using Decofleet.Application.Features.Vehiculos.Dtos;
using Decofleet.Domain.Vehiculos.Enums;
using MediatR;

namespace Decofleet.Application.Features.Vehiculos.Queries.GetVehiculos;

public sealed record GetVehiculosQuery(
    int Page = 1,
    int PageSize = 20,
    string? Search = null,
    EEstatusVehiculo? Estatus = null
) : IRequest<PagedResult<VehiculoDto>>;
