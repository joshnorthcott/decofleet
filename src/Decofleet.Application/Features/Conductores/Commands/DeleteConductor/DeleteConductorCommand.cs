using MediatR;

namespace Decofleet.Application.Features.Conductores.Commands.DeleteConductor;

public sealed record DeleteConductorCommand(Guid Id) : IRequest;
