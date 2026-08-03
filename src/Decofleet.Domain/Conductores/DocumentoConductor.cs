using Decofleet.Domain.Common.Enums;

namespace Decofleet.Domain.Conductores;

public sealed class DocumentoConductor : Common.BaseEntity
{
    public Guid ConductorId { get; set; }
    public Guid EmpresaId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public ECategoriaDocumento Categoria { get; set; }
    public string S3Key { get; set; } = string.Empty;
    public string? S3Url { get; set; }
    public long? TamanioBytes { get; set; }
    public string? MimeType { get; set; }
    public DateOnly? FechaVencimiento { get; set; }
    public Guid? SubidoPorId { get; set; }

    public Conductor? Conductor { get; set; }
}
