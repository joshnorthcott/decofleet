namespace Decofleet.Domain.Conductores;

public sealed class FacturacionConductor : Common.BaseEntity
{
    public Guid ConductorId { get; set; }
    public string? Rfc { get; set; }
    public string? RazonSocial { get; set; }
    public string? RegimenFiscal { get; set; }
    public string? UsoCfdi { get; set; }

    public Conductor? Conductor { get; set; }
}
