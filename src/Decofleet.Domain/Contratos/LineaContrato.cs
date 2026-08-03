namespace Decofleet.Domain.Contratos;

public sealed class LineaContrato : Common.BaseEntity
{
    public Guid ContratoId { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public DateOnly? FechaAplicacion { get; set; }

    public Contrato? Contrato { get; set; }
}
