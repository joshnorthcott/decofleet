using Decofleet.Application.Common.Models;
using Decofleet.Application.Features.Facturacion.Dtos;
using Decofleet.Domain.Facturacion.Enums;
using MediatR;

namespace Decofleet.Application.Features.Facturacion.Queries.GetPagosContrato;

public sealed record GetPagosContratoQuery(
    Guid? ContratoId = null,
    EEstatusPago? Estatus = null,
    int Page = 1,
    int PageSize = 20
) : IRequest<PagedResult<PagoContratoDto>>;
