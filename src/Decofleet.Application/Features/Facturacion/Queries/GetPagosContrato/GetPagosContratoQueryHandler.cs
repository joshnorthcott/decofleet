using Decofleet.Application.Common.Interfaces;
using Decofleet.Application.Common.Models;
using Decofleet.Application.Features.Facturacion.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Application.Features.Facturacion.Queries.GetPagosContrato;

public sealed class GetPagosContratoQueryHandler
    : IRequestHandler<GetPagosContratoQuery, PagedResult<PagoContratoDto>>
{
    private readonly IDecofleetDbContext _db;

    public GetPagosContratoQueryHandler(IDecofleetDbContext db) => _db = db;

    public async Task<PagedResult<PagoContratoDto>> Handle(
        GetPagosContratoQuery request, CancellationToken cancellationToken)
    {
        var query = _db.PagosContrato.AsNoTracking();

        if (request.ContratoId.HasValue)
            query = query.Where(p => p.ContratoId == request.ContratoId.Value);
        if (request.Estatus.HasValue)
            query = query.Where(p => p.Estatus == request.Estatus.Value);

        var total = await query.CountAsync(cancellationToken);

        var pagos = await query
            .OrderByDescending(p => p.PeriodoInicio)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => new
            {
                p.Id, p.ContratoId, p.EmpresaId,
                p.PeriodoInicio, p.PeriodoFin, p.MontoTotal,
                p.Estatus, p.FechaVencimiento, p.CreatedAt,
                MontoPagado = p.PagosEmitidos.Sum(e => e.Monto)
            })
            .ToListAsync(cancellationToken);

        var items = pagos.Select(p => new PagoContratoDto(
            p.Id, p.ContratoId, p.EmpresaId,
            p.PeriodoInicio, p.PeriodoFin, p.MontoTotal,
            p.MontoPagado, p.MontoTotal - p.MontoPagado,
            p.Estatus, p.FechaVencimiento, p.CreatedAt)).ToList();

        return PagedResult<PagoContratoDto>.Create(items, total, request.Page, request.PageSize);
    }
}
