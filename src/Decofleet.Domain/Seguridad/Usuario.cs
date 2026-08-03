namespace Decofleet.Domain.Seguridad;

public sealed class Usuario : Common.AuditableEntity
{
    public Guid EmpresaId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string? Apellido { get; set; }
    public Guid RolId { get; set; }
    public bool Activo { get; set; } = true;

    public Empresa? Empresa { get; set; }
    public Rol? Rol { get; set; }
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
