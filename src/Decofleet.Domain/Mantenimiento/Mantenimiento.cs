using Decofleet.Domain.Mantenimiento.Enums;

namespace Decofleet.Domain.Mantenimiento;

public sealed class Mantenimiento : Common.AuditableEntity
{
    public Guid EmpresaId { get; set; }
    public Guid VehiculoId { get; set; }
    public Guid TipoMantenimientoId { get; set; }
    public EEstatusMantenimiento Estatus { get; set; } = EEstatusMantenimiento.Programado;
    public DateTimeOffset? FechaProgramada { get; set; }
    public DateTimeOffset? FechaReal { get; set; }
    public string? Proveedor { get; set; }
    public decimal? CostoEstimado { get; set; }
    public decimal? CostoReal { get; set; }

    public Seguridad.Empresa? Empresa { get; set; }
    public Vehiculos.Vehiculo? Vehiculo { get; set; }
    public TipoMantenimiento? TipoMantenimiento { get; set; }
    public ICollection<RegistroMantenimiento> Registros { get; set; } = new List<RegistroMantenimiento>();
    public ICollection<CargoMantenimiento> Cargos { get; set; } = new List<CargoMantenimiento>();
    public ICollection<DocumentoMantenimiento> Documentos { get; set; } = new List<DocumentoMantenimiento>();
}
