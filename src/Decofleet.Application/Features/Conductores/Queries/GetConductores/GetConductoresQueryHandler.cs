using Decofleet.Application.Common.Interfaces;
using Decofleet.Application.Common.Models;
using Decofleet.Application.Features.Conductores.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Application.Features.Conductores.Queries.GetConductores;

public sealed class GetConductoresQueryHandler
    : IRequestHandler<GetConductoresQuery, PagedResult<ConductorDto>>
{
    private readonly IDecofleetDbContext _db;

    public GetConductoresQueryHandler(IDecofleetDbContext db) => _db = db;

    public async Task<PagedResult<ConductorDto>> Handle(
        GetConductoresQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Conductores.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var term = request.Search.ToLower();
            query = query.Where(c =>
                c.Nombre.ToLower().Contains(term) ||
                c.ApellidoPaterno.ToLower().Contains(term) ||
                (c.ApellidoMaterno != null && c.ApellidoMaterno.ToLower().Contains(term)) ||
                (c.Telefono != null && c.Telefono.Contains(term)) ||
                (c.Email != null && c.Email.ToLower().Contains(term)));
        }

        if (request.Estatus.HasValue)
            query = query.Where(c => c.Estatus == request.Estatus.Value);

        var total = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(c => new ConductorDto(
                c.Id,
                c.EmpresaId,
                c.Nombre,
                c.ApellidoPaterno,
                c.ApellidoMaterno,
                c.Nombre + " " + c.ApellidoPaterno + (c.ApellidoMaterno != null ? " " + c.ApellidoMaterno : ""),
                c.Curp,
                c.Telefono,
                c.Email,
                c.Direccion,
                c.CodigoPostal,
                c.Estatus,
                c.CreatedAt,
                c.UpdatedAt))
            .ToListAsync(cancellationToken);

        return PagedResult<ConductorDto>.Create(items, total, request.Page, request.PageSize);
    }
}
