using Decofleet.Application.Common.Exceptions;
using Decofleet.Application.Common.Interfaces;
using Decofleet.Domain.Seguridad;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Application.Features.Auth.Commands.Login;

public sealed class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly IDecofleetDbContext _db;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtGenerator;
    private readonly IDateTimeProvider _clock;

    public LoginCommandHandler(
        IDecofleetDbContext db,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtGenerator,
        IDateTimeProvider clock)
    {
        _db = db;
        _passwordHasher = passwordHasher;
        _jwtGenerator = jwtGenerator;
        _clock = clock;
    }

    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        // Bypass tenant + soft-delete filters — auth runs before we have a tenant context
        var usuario = await _db.Usuarios
            .IgnoreQueryFilters()
            .Include(u => u.Rol)
            .FirstOrDefaultAsync(
                u => u.Email == request.Email.ToLower()
                  && u.EmpresaId == request.EmpresaId
                  && u.DeletedAt == null,
                cancellationToken);

        if (usuario is null || !_passwordHasher.Verify(request.Password, usuario.PasswordHash))
            throw new ValidationException([new FluentValidation.Results.ValidationFailure(
                "Credentials", "Correo o contraseña incorrectos.")]);

        if (!usuario.Activo)
            throw new ValidationException([new FluentValidation.Results.ValidationFailure(
                "Credentials", "La cuenta está desactivada.")]);

        var (accessToken, expiresAt) = _jwtGenerator.GenerateAccessToken(usuario);
        var refreshTokenPlain = _jwtGenerator.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            UsuarioId = usuario.Id,
            TokenHash = _jwtGenerator.HashRefreshToken(refreshTokenPlain),
            ExpiresAt = _clock.UtcNow.AddDays(30),
        };

        _db.RefreshTokens.Add(refreshToken);
        await _db.SaveChangesAsync(cancellationToken);

        return new LoginResponse(
            AccessToken: accessToken,
            RefreshToken: refreshTokenPlain,
            AccessTokenExpiresAt: expiresAt,
            Usuario: new UsuarioInfo(
                usuario.Id,
                usuario.Email,
                usuario.Nombre,
                usuario.Apellido,
                usuario.EmpresaId,
                usuario.RolId));
    }
}
