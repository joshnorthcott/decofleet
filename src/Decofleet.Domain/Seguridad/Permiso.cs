namespace Decofleet.Domain.Seguridad;

public sealed class Permiso : Common.BaseEntity
{
    /// <summary>Unique permission key, e.g. "conductores.write" or "pagos.read".</summary>
    public string Clave { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;

    public ICollection<RolPermiso> RolPermisos { get; set; } = new List<RolPermiso>();
}
