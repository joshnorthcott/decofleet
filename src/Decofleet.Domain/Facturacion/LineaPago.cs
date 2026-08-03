namespace Decofleet.Domain.Facturacion;

public sealed class LineaPago : Common.BaseEntity
{
    public Guid PagoEmitidoId { get; set; }
    public Guid CargoId { get; set; }
    public decimal MontoAplicado { get; set; }

    public PagoEmitido? PagoEmitido { get; set; }
    public Cargo? Cargo { get; set; }
}
