using Decofleet.Domain.Facturacion.Enums;

namespace Decofleet.Domain.Facturacion;

public sealed class PagoContrato : Common.AuditableEntity
{
    public Guid ContratoId { get; set; }
    public Guid EmpresaId { get; set; }
    public DateOnly PeriodoInicio { get; set; }
    public DateOnly PeriodoFin { get; set; }
    public decimal MontoTotal { get; set; }
    public EEstatusPago Estatus { get; set; } = EEstatusPago.Pendiente;
    public DateOnly? FechaVencimiento { get; set; }

    public Contratos.Contrato? Contrato { get; set; }
    public Seguridad.Empresa? Empresa { get; set; }
    public ICollection<Cargo> Cargos { get; set; } = new List<Cargo>();
    public ICollection<PagoEmitido> PagosEmitidos { get; set; } = new List<PagoEmitido>();
}
