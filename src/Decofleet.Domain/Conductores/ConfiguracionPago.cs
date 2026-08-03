using Decofleet.Domain.Conductores.Enums;

namespace Decofleet.Domain.Conductores;

public sealed class ConfiguracionPago : Common.BaseEntity
{
    public Guid ConductorId { get; set; }
    public Guid EmpresaId { get; set; }
    public string? Tipo { get; set; }
    public decimal Monto { get; set; }
    public int? DiaCorte { get; set; }
    public ECuentaPago CuentaPago { get; set; } = ECuentaPago.Bancaria;

    public Conductor? Conductor { get; set; }
}
