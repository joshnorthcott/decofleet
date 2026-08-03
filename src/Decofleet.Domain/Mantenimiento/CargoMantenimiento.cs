namespace Decofleet.Domain.Mantenimiento;

public sealed class CargoMantenimiento : Common.BaseEntity
{
    public Guid MantenimientoId { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public decimal Monto { get; set; }

    public Mantenimiento? Mantenimiento { get; set; }
}
