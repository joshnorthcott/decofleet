using Decofleet.Application.Common.Exceptions;
using Decofleet.Application.Common.Interfaces;
using Decofleet.Domain.Contratos.Enums;
using Decofleet.Domain.Vehiculos.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Application.Features.Contratos.Commands.ActualizarEstatusContrato;

public sealed class ActualizarEstatusContratoCommandHandler
    : IRequestHandler<ActualizarEstatusContratoCommand>
{
    private readonly IDecofleetDbContext _db;
    private readonly ICurrentUserService _currentUser;

    public ActualizarEstatusContratoCommandHandler(IDecofleetDbContext db, ICurrentUserService currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }

    public async Task Handle(ActualizarEstatusContratoCommand request, CancellationToken cancellationToken)
    {
        var contrato = await _db.Contratos
            .Include(c => c.Vehiculo)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Contratos.Contrato), request.Id);

        contrato.Estatus = request.NuevoEstatus;
        contrato.UpdatedById = _currentUser.UserId;

        // When contract ends, release the vehicle
        if (request.NuevoEstatus is EEstatusContrato.Cancelado or EEstatusContrato.Finalizado)
        {
            if (contrato.Vehiculo is not null)
                contrato.Vehiculo.Estatus = EEstatusVehiculo.Disponible;
        }

        await _db.SaveChangesAsync(cancellationToken);
    }
}
