using Decofleet.Application.Common.Interfaces;
using Decofleet.Application.Features.Conductores.Dtos;
using Decofleet.Domain.Conductores;
using MediatR;

namespace Decofleet.Application.Features.Conductores.Commands.CreateConductor;

public sealed class CreateConductorCommandHandler : IRequestHandler<CreateConductorCommand, ConductorDto>
{
    private readonly IDecofleetDbContext _db;
    private readonly ITenantContext _tenant;
    private readonly ICurrentUserService _currentUser;

    public CreateConductorCommandHandler(
        IDecofleetDbContext db, ITenantContext tenant, ICurrentUserService currentUser)
    {
        _db = db;
        _tenant = tenant;
        _currentUser = currentUser;
    }

    public async Task<ConductorDto> Handle(CreateConductorCommand request, CancellationToken cancellationToken)
    {
        var conductor = new Conductor
        {
            EmpresaId = _tenant.EmpresaId,
            Nombre = request.Nombre,
            ApellidoPaterno = request.ApellidoPaterno,
            ApellidoMaterno = request.ApellidoMaterno,
            Curp = request.Curp?.ToUpper(),
            Telefono = request.Telefono,
            Email = request.Email?.ToLower(),
            Direccion = request.Direccion,
            CodigoPostal = request.CodigoPostal,
            CreatedById = _currentUser.UserId,
        };

        _db.Conductores.Add(conductor);
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
