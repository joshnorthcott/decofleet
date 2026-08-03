using Decofleet.Application.Common.Interfaces;
using Decofleet.Application.Features.Vehiculos.Dtos;
using Decofleet.Domain.Vehiculos;
using MediatR;

namespace Decofleet.Application.Features.Vehiculos.Commands.CreateVehiculo;

public sealed class CreateVehiculoCommandHandler : IRequestHandler<CreateVehiculoCommand, VehiculoDto>
{
    private readonly IDecofleetDbContext _db;
    private readonly ITenantContext _tenant;
    private readonly ICurrentUserService _currentUser;

    public CreateVehiculoCommandHandler(
        IDecofleetDbContext db, ITenantContext tenant, ICurrentUserService currentUser)
    {
        _db = db;
        _tenant = tenant;
        _currentUser = currentUser;
    }

    public async Task<VehiculoDto> Handle(CreateVehiculoCommand request, CancellationToken cancellationToken)
    {
        var vehiculo = new Vehiculo
        {
            EmpresaId = _tenant.EmpresaId,
            Marca = request.Marca,
            Modelo = request.Modelo,
            Anio = request.Anio,
            Placas = request.Placas?.ToUpper(),
            Vin = request.Vin?.ToUpper(),
            Color = request.Color,
            Telefono = request.Telefono,
            CreatedById = _currentUser.UserId,
        };

        _db.Vehiculos.Add(vehiculo);
        await _db.SaveChangesAsync(cancellationToken);

        return new VehiculoDto(
            vehiculo.Id, vehiculo.EmpresaId, vehiculo.Marca, vehiculo.Modelo,
            vehiculo.Anio, vehiculo.Placas, vehiculo.Vin, vehiculo.Color,
            vehiculo.Estatus, vehiculo.Telefono, vehiculo.CreatedAt, vehiculo.UpdatedAt);
    }
}
