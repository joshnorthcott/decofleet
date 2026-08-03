namespace Decofleet.Domain.Seguridad;

public sealed class Empresa : Common.AuditableEntity
{
    public string Nombre { get; set; } = string.Empty;
    public string? Rfc { get; set; }
    public string? Telefono { get; set; }
    public string? LogoUrl { get; set; }
    /// <summary>Arbitrary company configuration stored as JSON.</summary>
    public string? Config { get; set; }

    public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
    public ICollection<Rol> Roles { get; set; } = new List<Rol>();
}
