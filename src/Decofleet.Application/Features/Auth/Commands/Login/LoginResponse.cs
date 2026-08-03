namespace Decofleet.Application.Features.Auth.Commands.Login;

public sealed record LoginResponse(
    string AccessToken,
    string RefreshToken,
    DateTimeOffset AccessTokenExpiresAt,
    UsuarioInfo Usuario
);

public sealed record UsuarioInfo(
    Guid Id,
    string Email,
    string Nombre,
    string? Apellido,
    Guid EmpresaId,
    Guid RolId
);
