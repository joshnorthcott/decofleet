using Decofleet.Domain.Seguridad;

namespace Decofleet.Application.Common.Interfaces;

public interface IJwtTokenGenerator
{
    /// <summary>Generates a signed JWT access token for the given user.</summary>
    (string Token, DateTimeOffset ExpiresAt) GenerateAccessToken(Usuario usuario);

    /// <summary>Generates a cryptographically random refresh token string (plain text — store its hash).</summary>
    string GenerateRefreshToken();

    /// <summary>Returns the SHA-256 hash of a refresh token for secure storage.</summary>
    string HashRefreshToken(string refreshToken);
}
