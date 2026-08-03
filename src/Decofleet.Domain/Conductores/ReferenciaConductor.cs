namespace Decofleet.Domain.Conductores;

public sealed class ReferenciaConductor : Common.BaseEntity
{
    public Guid ConductorId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string? Relacion { get; set; }

    public Conductor? Conductor { get; set; }
}
