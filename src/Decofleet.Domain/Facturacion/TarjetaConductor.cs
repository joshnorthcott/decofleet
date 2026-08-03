namespace Decofleet.Domain.Facturacion;

public sealed class TarjetaConductor : Common.AuditableEntity
{
    public Guid ConductorId { get; set; }
    public Guid EmpresaId { get; set; }
    /// <summary>Last 4 digits of the card number — display only.</summary>
    public string Last4 { get; set; } = string.Empty;
    public string? Marca { get; set; }
    /// <summary>Opaque gateway token — raw PAN is never stored.</summary>
    public string TokenGateway { get; set; } = string.Empty;
    public bool Activa { get; set; } = true;

    public Conductores.Conductor? Conductor { get; set; }
    public Seguridad.Empresa? Empresa { get; set; }
}
