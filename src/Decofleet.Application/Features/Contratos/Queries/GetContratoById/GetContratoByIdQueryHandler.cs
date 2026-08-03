using Decofleet.Application.Common.Exceptions;
using Decofleet.Application.Common.Interfaces;
using Decofleet.Application.Features.Contratos.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Application.Features.Contratos.Queries.GetContratoById;

public sealed class GetContratoByIdQueryHandler : IRequestHandler<GetContratoByIdQuery, ContratoDto>
{
    private readonly IDecofleetDbContext _db;

    public GetContratoByIdQueryHandler(IDecofleetDbContext db) => _db = db;

    public async Task<ContratoDto> Handle(GetContratoByIdQuery request, CancellationToken cancellationToken)
    {
        var c = await _db.Contratos
            .AsNoTracking()
            .Include(x => x.Conductor)
            .Include(x => x.Vehiculo)
            .Include(x => x.Tarifa)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Contratos.Contrato), request.Id);

        return new ContratoDto(
            c.Id, c.EmpresaId, c.ConductorId,
            c.Conductor!.Nombre + " " + c.Conductor.ApellidoPaterno,
            c.VehiculoId,
            c.Vehiculo!.Marca + " " + c.Vehiculo.Modelo + " " + c.Vehiculo.Anio,
            c.TarifaId, c.Tarifa!.Nombre, c.Tarifa.MontoRenta, c.Tarifa.Periodicidad,
            c.FechaInicio, c.FechaFin, c.Estatus, c.FormaPago, c.Observaciones,
            c.CreatedAt);
    }
}
