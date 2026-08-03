using Decofleet.Application.Common.Exceptions;
using Decofleet.Application.Common.Interfaces;
using Decofleet.Application.Features.Vehiculos.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Application.Features.Vehiculos.Queries.GetVehiculoById;

public sealed class GetVehiculoByIdQueryHandler : IRequestHandler<GetVehiculoByIdQuery, VehiculoDto>
{
    private readonly IDecofleetDbContext _db;

    public GetVehiculoByIdQueryHandler(IDecofleetDbContext db) => _db = db;

    public async Task<VehiculoDto> Handle(GetVehiculoByIdQuery request, CancellationToken cancellationToken)
    {
        var v = await _db.Vehiculos
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Vehiculos.Vehiculo), request.Id);

        return new VehiculoDto(
            v.Id, v.EmpresaId, v.Marca, v.Modelo, v.Anio,
            v.Placas, v.Vin, v.Color, v.Estatus, v.Telefono,
            v.CreatedAt, v.UpdatedAt);
    }
}
