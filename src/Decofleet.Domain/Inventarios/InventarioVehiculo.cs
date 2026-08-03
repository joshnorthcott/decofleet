namespace Decofleet.Domain.Inventarios;

public sealed class InventarioVehiculo : Common.AuditableEntity
{
    public Guid EmpresaId { get; set; }
    public Guid VehiculoId { get; set; }
    public Guid? ConductorId { get; set; }
    public DateTimeOffset Fecha { get; set; }
    public string? Observaciones { get; set; }
    /// <summary>Arbitrary key-value metadata stored as JSONB in PostgreSQL.</summary>
    public string? Metadata { get; set; }

    public Seguridad.Empresa? Empresa { get; set; }
    public Vehiculos.Vehiculo? Vehiculo { get; set; }
    public Conductores.Conductor? Conductor { get; set; }
    public ICollection<DocumentoInventario> Documentos { get; set; } = new List<DocumentoInventario>();
}
