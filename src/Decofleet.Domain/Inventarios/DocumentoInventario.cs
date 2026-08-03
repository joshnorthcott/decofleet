namespace Decofleet.Domain.Inventarios;

public sealed class DocumentoInventario : Common.BaseEntity
{
    public Guid InventarioId { get; set; }
    public Guid EmpresaId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string S3Key { get; set; } = string.Empty;
    public string? S3Url { get; set; }
    public int Orden { get; set; }

    public InventarioVehiculo? Inventario { get; set; }
}
