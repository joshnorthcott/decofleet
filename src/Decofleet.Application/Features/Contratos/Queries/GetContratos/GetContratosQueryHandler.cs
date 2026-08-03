using Decofleet.Application.Common.Interfaces;
using Decofleet.Application.Common.Models;
using Decofleet.Application.Features.Contratos.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Application.Features.Contratos.Queries.GetContratos;

public sealed class GetContratosQueryHandler : IRequestHandler<GetContratosQuery, PagedResult<ContratoDto>>
{
    private readonly IDecofleetDbContext _db;

    public GetContratosQueryHandler(IDecofleetDbContext db) => _db = db;

    public async Task<PagedResult<ContratoDto>> Handle(
        GetContratosQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Contratos
            .AsNoTracking()
            .Include(c => c.Conductor)
            .Include(c => c.Vehiculo)
            .Include(c => c.Tarifa)
            .AsQueryable();

        if (request.Estatus.HasValue)
            query = query.Where(c => c.Estatus == request.Estatus.Value);
        if (request.ConductorId.HasValue)
            query = query.Where(c => c.ConductorId == request.ConductorId.Value);
        if (request.VehiculoId.HasValue)
            query = query.Where(c => c.VehiculoId == request.VehiculoId.Value);

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(c => new ContratoDto(
                c.Id, c.EmpresaId, c.ConductorId,
                c.Conductor!.Nombre + " " + c.Conductor.ApellidoPaterno,
                c.VehiculoId,
                c.Vehiculo!.Marca + " " + c.Vehiculo.Modelo + " " + c.Vehiculo.Anio,
                c.TarifaId, c.Tarifa!.Nombre, c.Tarifa.MontoRenta, c.Tarifa.Periodicidad,
                c.FechaInicio, c.FechaFin, c.Estatus, c.FormaPago, c.Observaciones,
                c.CreatedAt))
            .ToListAsync(cancellationToken);

        return PagedResult<ContratoDto>.Create(items, total, request.Page, request.PageSize);
    }
}
