using Decofleet.Application.Common.Exceptions;
using Decofleet.Application.Common.Interfaces;
using Decofleet.Application.Features.Conductores.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Application.Features.Conductores.Commands.UpdateConductor;

public sealed class UpdateConductorCommandHandler : IRequestHandler<UpdateConductorCommand, ConductorDto>
{
    private readonly IDecofleetDbContext _db;
    private readonly ICurrentUserService _currentUser;

    public UpdateConductorCommandHandler(IDecofleetDbContext db, ICurrentUserService currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }

    public async Task<ConductorDto> Handle(UpdateConductorCommand request, CancellationToken cancellationToken)
    {
        var conductor = await _db.Conductores
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Conductores.Conductor), request.Id);

        conductor.Nombre = request.Nombre;
        conductor.ApellidoPaterno = request.ApellidoPaterno;
        conductor.ApellidoMaterno = request.ApellidoMaterno;
        conductor.Curp = request.Curp?.ToUpper();
        conductor.Telefono = request.Telefono;
        conductor.Email = request.Email?.ToLower();
        conductor.Direccion = request.Direccion;
        conductor.CodigoPostal = request.CodigoPostal;
        conductor.Estatus = request.Estatus;
        conductor.UpdatedById = _currentUser.UserId;

        await _db.SaveChangesAsync(cancellationToken);

        return new ConductorDto(
            conductor.Id, conductor.EmpresaId, conductor.Nombre,
            conductor.ApellidoPaterno, conductor.ApellidoMaterno,
            conductor.Nombre + " " + conductor.ApellidoPaterno
                + (conductor.ApellidoMaterno != null ? " " + conductor.ApellidoMaterno : ""),
            conductor.Curp, conductor.Telefono, conductor.Email,
            conductor.Direccion, conductor.CodigoPostal,
            conductor.Estatus, conductor.CreatedAt, conductor.UpdatedAt);
    }
}
