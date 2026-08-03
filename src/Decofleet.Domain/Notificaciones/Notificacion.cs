using Decofleet.Domain.Notificaciones.Enums;

namespace Decofleet.Domain.Notificaciones;

public sealed class Notificacion : Common.BaseEntity
{
    public Guid EmpresaId { get; set; }
    public Guid PlantillaId { get; set; }
    public Guid? ConductorId { get; set; }
    public ETipoNotificacion Canal { get; set; }
    public EEstatusNotificacion Estatus { get; set; } = EEstatusNotificacion.Pendiente;
    public DateTimeOffset? EnviadoAt { get; set; }
    public string? ErrorMsg { get; set; }

    public Seguridad.Empresa? Empresa { get; set; }
    public PlantillaNotificacion? Plantilla { get; set; }
    public Conductores.Conductor? Conductor { get; set; }
}
