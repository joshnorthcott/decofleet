using Decofleet.Domain.Notificaciones.Enums;

namespace Decofleet.Domain.Notificaciones;

public sealed class PlantillaNotificacion : Common.AuditableEntity
{
    public Guid EmpresaId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Asunto { get; set; }
    public string Cuerpo { get; set; } = string.Empty;
    public ETipoNotificacion Tipo { get; set; }
    /// <summary>JSON array of placeholder variable names, e.g. ["nombre","monto","fecha"].</summary>
    public string? Variables { get; set; }

    public Seguridad.Empresa? Empresa { get; set; }
    public ICollection<Notificacion> Notificaciones { get; set; } = new List<Notificacion>();
}
