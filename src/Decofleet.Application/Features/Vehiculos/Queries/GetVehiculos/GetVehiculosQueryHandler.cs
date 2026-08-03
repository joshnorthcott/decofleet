using Decofleet.Application.Common.Interfaces;
using Decofleet.Application.Common.Models;
using Decofleet.Application.Features.Vehiculos.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Application.Features.Vehiculos.Queries.GetVehiculos;

public sealed class GetVehiculosQueryHandler : IRequestHandler<GetVehiculosQuery, PagedResult<VehiculoDto>>
{
    private readonly IDecofleetDbContext _db;

    public GetVehiculosQueryHandler(IDecofleetDbContext db) => _db = db;

    public async Task<PagedResult<VehiculoDto>> Handle(
        GetVehiculosQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Vehiculos.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var term = request.Search.ToLower();
            query = query.Where(v =>
                v.Marca.ToLower().Contains(term) ||
                v.Modelo.ToLower().Contains(term) ||
                (v.Placas != null && v.Placas.ToLower().Contains(term)) ||
                (v.Vin != null && v.Vin.ToLower().Contains(term)));
        }

        if (request.Estatus.HasValue)
            query = query.Where(v => v.Estatus == request.Estatus.Value);

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(v => v.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(v => new VehiculoDto(
                v.Id, v.EmpresaId, v.Marca, v.Modelo, v.Anio,
                v.Placas, v.Vin, v.Color, v.Estatus, v.Telefono,
                v.CreatedAt, v.UpdatedAt))
            .ToListAsync(cancellationToken);

        return PagedResult<VehiculoDto>.Create(items, total, request.Page, request.PageSize);
    }
}
