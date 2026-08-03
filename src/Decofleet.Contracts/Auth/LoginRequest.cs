namespace Decofleet.Contracts.Auth;

public sealed record LoginRequest(
    string Email,
    string Password,
    Guid EmpresaId
);
