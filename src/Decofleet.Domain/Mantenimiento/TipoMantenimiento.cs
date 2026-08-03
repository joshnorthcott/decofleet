namespace Decofleet.Domain.Mantenimiento;

public sealed class TipoMantenimiento : Common.AuditableEntity
{
    public Guid EmpresaId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    /// <summary>
    /// When true, this type represents an incident/collision record (siniestro).
    /// Unifies the separate MantenimientoSiniestros module from v1 into a single table.
    /// </summary>
    public bool EsSiniestro { get; set; }

    public Seguridad.Empresa? Empresa { get; set; }
    public ICollection<Mantenimiento> Mantenimientos { get; set; } = new List<Mantenimiento>();
}
