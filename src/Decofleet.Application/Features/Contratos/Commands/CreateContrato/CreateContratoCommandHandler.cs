using Decofleet.Application.Common.Exceptions;
using Decofleet.Application.Common.Interfaces;
using Decofleet.Application.Features.Contratos.Dtos;
using Decofleet.Domain.Contratos;
using Decofleet.Domain.Vehiculos.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Application.Features.Contratos.Commands.CreateContrato;

public sealed class CreateContratoCommandHandler : IRequestHandler<CreateContratoCommand, ContratoDto>
{
    private readonly IDecofleetDbContext _db;
    private readonly ITenantContext _tenant;
    private readonly ICurrentUserService _currentUser;

    public CreateContratoCommandHandler(
        IDecofleetDbContext db, ITenantContext tenant, ICurrentUserService currentUser)
    {
        _db = db;
        _tenant = tenant;
        _currentUser = currentUser;
    }

    public async Task<ContratoDto> Handle(CreateContratoCommand request, CancellationToken cancellationToken)
    {
        // Validate business rules
        var conductor = await _db.Conductores
            .FirstOrDefaultAsync(c => c.Id == request.ConductorId, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Conductores.Conductor), request.ConductorId);

        var vehiculo = await _db.Vehiculos
            .FirstOrDefaultAsync(v => v.Id == request.VehiculoId, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Vehiculos.Vehiculo), request.VehiculoId);

        var tarifa = await _db.Tarifas
            .FirstOrDefaultAsync(t => t.Id == request.TarifaId, cancellationToken)
            ?? throw new NotFoundException(nameof(Tarifa), request.TarifaId);

        if (vehiculo.Estatus != EEstatusVehiculo.Disponible)
            throw new ValidationException([new FluentValidation.Results.ValidationFailure(
                "VehiculoId", "El vehículo no está disponible para arrendamiento.")]);

        var hasActiveContract = await _db.Contratos
            .AnyAsync(c => c.VehiculoId == request.VehiculoId
                        && c.Estatus == Domain.Contratos.Enums.EEstatusContrato.Activo,
                cancellationToken);
        if (hasActiveContract)
            throw new ValidationException([new FluentValidation.Results.ValidationFailure(
                "VehiculoId", "El vehículo ya tiene un contrato activo.")]);

        var contrato = new Contrato
        {
            EmpresaId = _tenant.EmpresaId,
            ConductorId = request.ConductorId,
            VehiculoId = request.VehiculoId,
            TarifaId = request.TarifaId,
            FechaInicio = request.FechaInicio,
            FechaFin = request.FechaFin,
            FormaPago = request.FormaPago,
            Observaciones = request.Observaciones,
            CreatedById = _currentUser.UserId,
        };

        vehiculo.Estatus = EEstatusVehiculo.Arrendado;
        _db.Contratos.Add(contrato);
        await _db.SaveChangesAsync(cancellationToken);

        return new ContratoDto(
            contrato.Id, contrato.EmpresaId,
            conductor.Id, conductor.Nombre + " " + conductor.ApellidoPaterno,
            vehiculo.Id, vehiculo.Marca + " " + vehiculo.Modelo + " " + vehiculo.Anio,
            tarifa.Id, tarifa.Nombre, tarifa.MontoRenta, tarifa.Periodicidad,
            contrato.FechaInicio, contrato.FechaFin,
            contrato.Estatus, contrato.FormaPago, contrato.Observaciones,
            contrato.CreatedAt);
    }
}
