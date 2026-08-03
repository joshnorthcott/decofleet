using Decofleet.Application.Common.Exceptions;
using Decofleet.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Application.Features.Conductores.Commands.DeleteConductor;

public sealed class DeleteConductorCommandHandler : IRequestHandler<DeleteConductorCommand>
{
    private readonly IDecofleetDbContext _db;
    private readonly IDateTimeProvider _clock;

    public DeleteConductorCommandHandler(IDecofleetDbContext db, IDateTimeProvider clock)
    {
        _db = db;
        _clock = clock;
    }

    public async Task Handle(DeleteConductorCommand request, CancellationToken cancellationToken)
    {
        var conductor = await _db.Conductores
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Conductores.Conductor), request.Id);

        conductor.DeletedAt = _clock.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);
    }
}
