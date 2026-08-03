using Decofleet.Domain.Conductores.Enums;

namespace Decofleet.Domain.Conductores;

public sealed class Licencia : Common.BaseEntity
{
    public Guid ConductorId { get; set; }
    public ETipoLicencia Tipo { get; set; }
    public string Numero { get; set; } = string.Empty;
    public DateOnly FechaExpedicion { get; set; }
    public DateOnly FechaVencimiento { get; set; }

    public Conductor? Conductor { get; set; }
}
