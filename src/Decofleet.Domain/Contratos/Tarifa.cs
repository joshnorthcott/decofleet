using Decofleet.Domain.Contratos.Enums;

namespace Decofleet.Domain.Contratos;

public sealed class Tarifa : Common.AuditableEntity
{
    public Guid EmpresaId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public decimal MontoRenta { get; set; }
    public decimal MontoActivacion { get; set; }
    public EPeriodicidad Periodicidad { get; set; } = EPeriodicidad.Semanal;
    public EFormaPago FormaPago { get; set; } = EFormaPago.Efectivo;

    public Seguridad.Empresa? Empresa { get; set; }
    public ICollection<Contrato> Contratos { get; set; } = new List<Contrato>();
}
