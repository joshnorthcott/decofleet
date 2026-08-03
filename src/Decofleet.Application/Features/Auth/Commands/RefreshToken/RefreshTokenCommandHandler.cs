using Decofleet.Application.Common.Exceptions;
using Decofleet.Application.Common.Interfaces;
using Decofleet.Application.Features.Auth.Commands.Login;
using Decofleet.Domain.Seguridad;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Application.Features.Auth.Commands.RefreshToken;

public sealed class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, LoginResponse>
{
    private readonly IDecofleetDbContext _db;
    private readonly IJwtTokenGenerator _jwtGenerator;
    private readonly IDateTimeProvider _clock;

    public RefreshTokenCommandHandler(
        IDecofleetDbContext db,
        IJwtTokenGenerator jwtGenerator,
        IDateTimeProvider clock)
    {
        _db = db;
        _jwtGenerator = jwtGenerator;
        _clock = clock;
    }

    public async Task<LoginResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var hash = _jwtGenerator.HashRefreshToken(request.RefreshToken);

        var token = await _db.RefreshTokens
            .IgnoreQueryFilters()
            .Include(t => t.Usuario)
            .FirstOrDefaultAsync(t => t.TokenHash == hash, cancellationToken);

        if (token is null || !token.IsActive)
            throw new ValidationException([new FluentValidation.Results.ValidationFailure(
                "RefreshToken", "El refresh token es inválido o ha expirado.")]);

        // Rotate: revoke old token, issue new pair
        token.RevokedAt = _clock.UtcNow;

        var usuario = token.Usuario!;
        var (accessToken, expiresAt) = _jwtGenerator.GenerateAccessToken(usuario);
        var newRefreshPlain = _jwtGenerator.GenerateRefreshToken();

        _db.RefreshTokens.Add(new RefreshToken
        {
            UsuarioId = usuario.Id,
            TokenHash = _jwtGenerator.HashRefreshToken(newRefreshPlain),
            ExpiresAt = _clock.UtcNow.AddDays(30),
        });

        await _db.SaveChangesAsync(cancellationToken);

        return new LoginResponse(
            AccessToken: accessToken,
            RefreshToken: newRefreshPlain,
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
