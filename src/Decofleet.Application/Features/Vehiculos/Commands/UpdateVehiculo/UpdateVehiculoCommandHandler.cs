using Decofleet.Application.Common.Exceptions;
using Decofleet.Application.Common.Interfaces;
using Decofleet.Application.Features.Vehiculos.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Application.Features.Vehiculos.Commands.UpdateVehiculo;

public sealed class UpdateVehiculoCommandHandler : IRequestHandler<UpdateVehiculoCommand, VehiculoDto>
{
    private readonly IDecofleetDbContext _db;
    private readonly ICurrentUserService _currentUser;

    public UpdateVehiculoCommandHandler(IDecofleetDbContext db, ICurrentUserService currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }

    public async Task<VehiculoDto> Handle(UpdateVehiculoCommand request, CancellationToken cancellationToken)
    {
        var vehiculo = await _db.Vehiculos
            .FirstOrDefaultAsync(v => v.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Vehiculos.Vehiculo), request.Id);

        vehiculo.Marca = request.Marca;
        vehiculo.Modelo = request.Modelo;
        vehiculo.Anio = request.Anio;
        vehiculo.Placas = request.Placas?.ToUpper();
        vehiculo.Vin = request.Vin?.ToUpper();
        vehiculo.Color = request.Color;
        vehiculo.Telefono = request.Telefono;
        vehiculo.Estatus = request.Estatus;
        vehiculo.UpdatedById = _currentUser.UserId;

        await _db.SaveChangesAsync(cancellationToken);

        return new VehiculoDto(
            vehiculo.Id, vehiculo.EmpresaId, vehiculo.Marca, vehiculo.Modelo,
            vehiculo.Anio, vehiculo.Placas, vehiculo.Vin, vehiculo.Color,
            vehiculo.Estatus, vehiculo.Telefono, vehiculo.CreatedAt, vehiculo.UpdatedAt);
    }
}
