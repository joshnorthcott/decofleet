using Decofleet.Domain.Contratos.Enums;

namespace Decofleet.Domain.Contratos;

public sealed class Contrato : Common.AuditableEntity
{
    public Guid EmpresaId { get; set; }
    public Guid ConductorId { get; set; }
    public Guid VehiculoId { get; set; }
    public Guid TarifaId { get; set; }
    public DateOnly FechaInicio { get; set; }
    public DateOnly? FechaFin { get; set; }
    public EEstatusContrato Estatus { get; set; } = EEstatusContrato.Activo;
    public EFormaPago FormaPago { get; set; } = EFormaPago.Efectivo;
    public string? Observaciones { get; set; }

    public Seguridad.Empresa? Empresa { get; set; }
    public Conductores.Conductor? Conductor { get; set; }
    public Vehiculos.Vehiculo? Vehiculo { get; set; }
    public Tarifa? Tarifa { get; set; }
    public ICollection<LineaContrato> Lineas { get; set; } = new List<LineaContrato>();
    public ICollection<Facturacion.PagoContrato> Pagos { get; set; } = new List<Facturacion.PagoContrato>();
}
