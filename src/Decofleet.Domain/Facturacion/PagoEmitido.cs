using Decofleet.Domain.Contratos.Enums;

namespace Decofleet.Domain.Facturacion;

public sealed class PagoEmitido : Common.AuditableEntity
{
    public Guid PagoContratoId { get; set; }
    public Guid EmpresaId { get; set; }
    public decimal Monto { get; set; }
    public EFormaPago FormaPago { get; set; }
    public DateTimeOffset FechaPago { get; set; }
    public string? Referencia { get; set; }
    public string? TicketUrl { get; set; }

    public PagoContrato? PagoContrato { get; set; }
    public Seguridad.Empresa? Empresa { get; set; }
    public ICollection<LineaPago> LineasPago { get; set; } = new List<LineaPago>();
}
