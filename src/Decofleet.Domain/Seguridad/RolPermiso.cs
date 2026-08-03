namespace Decofleet.Domain.Seguridad;

/// <summary>Explicit join entity for the Rol ↔ Permiso many-to-many relationship.</summary>
public sealed class RolPermiso
{
    public Guid RolId { get; set; }
    public Guid PermisoId { get; set; }

    public Rol? Rol { get; set; }
    public Permiso? Permiso { get; set; }
}
