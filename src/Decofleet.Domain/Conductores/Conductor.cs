using Decofleet.Domain.Conductores.Enums;

namespace Decofleet.Domain.Conductores;

public sealed class Conductor : Common.AuditableEntity
{
    public Guid EmpresaId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string ApellidoPaterno { get; set; } = string.Empty;
    public string? ApellidoMaterno { get; set; }
    public string? Curp { get; set; }
    public string? Telefono { get; set; }
    public string? Email { get; set; }
    public string? Direccion { get; set; }
    public string? CodigoPostal { get; set; }
    public EEstatusConductor Estatus { get; set; } = EEstatusConductor.Activo;

    public Seguridad.Empresa? Empresa { get; set; }
    public ICollection<Licencia> Licencias { get; set; } = new List<Licencia>();
    public ICollection<ReferenciaConductor> Referencias { get; set; } = new List<ReferenciaConductor>();
    public ConfiguracionPago? ConfiguracionPago { get; set; }
    public FacturacionConductor? DatosFacturacion { get; set; }
    public ICollection<DocumentoConductor> Documentos { get; set; } = new List<DocumentoConductor>();
}
