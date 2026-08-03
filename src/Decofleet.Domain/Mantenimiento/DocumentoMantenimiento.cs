namespace Decofleet.Domain.Mantenimiento;

public sealed class DocumentoMantenimiento : Common.BaseEntity
{
    public Guid MantenimientoId { get; set; }
    public Guid EmpresaId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string S3Key { get; set; } = string.Empty;
    public string? S3Url { get; set; }

    public Mantenimiento? Mantenimiento { get; set; }
}
