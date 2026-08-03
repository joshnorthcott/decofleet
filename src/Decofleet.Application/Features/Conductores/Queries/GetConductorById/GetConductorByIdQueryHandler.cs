using Decofleet.Application.Common.Exceptions;
using Decofleet.Application.Common.Interfaces;
using Decofleet.Application.Features.Conductores.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Application.Features.Conductores.Queries.GetConductorById;

public sealed class GetConductorByIdQueryHandler : IRequestHandler<GetConductorByIdQuery, ConductorDto>
{
    private readonly IDecofleetDbContext _db;

    public GetConductorByIdQueryHandler(IDecofleetDbContext db) => _db = db;

    public async Task<ConductorDto> Handle(GetConductorByIdQuery request, CancellationToken cancellationToken)
    {
        var c = await _db.Conductores
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Conductores.Conductor), request.Id);

        return new ConductorDto(
            c.Id, c.EmpresaId, c.Nombre, c.ApellidoPaterno, c.ApellidoMaterno,
            c.Nombre + " " + c.ApellidoPaterno + (c.ApellidoMaterno != null ? " " + c.ApellidoMaterno : ""),
            c.Curp, c.Telefono, c.Email, c.Direccion, c.CodigoPostal,
            c.Estatus, c.CreatedAt, c.UpdatedAt);
    }
}
