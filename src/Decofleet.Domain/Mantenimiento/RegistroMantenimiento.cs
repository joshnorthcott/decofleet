namespace Decofleet.Domain.Mantenimiento;

public sealed class RegistroMantenimiento : Common.BaseEntity
{
    public Guid MantenimientoId { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public DateTimeOffset Fecha { get; set; }
    public Guid? UsuarioId { get; set; }

    public Mantenimiento? Mantenimiento { get; set; }
}
