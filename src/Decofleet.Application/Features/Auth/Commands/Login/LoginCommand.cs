using MediatR;

namespace Decofleet.Application.Features.Auth.Commands.Login;

public sealed record LoginCommand(
    string Email,
    string Password,
    Guid EmpresaId
) : IRequest<LoginResponse>;
