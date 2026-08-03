using Decofleet.Domain.Facturacion.Enums;

namespace Decofleet.Domain.Facturacion;

/// <summary>
/// Unified charge entity — covers rent (Renta), additional charges (Adicional),
/// workshop costs (Taller), and extra charges (Extra).
/// Replaces the split CargoRenta / CargoAdicional / CargoTaller tables from v1.
/// </summary>
public sealed class Cargo : Common.BaseEntity
{
    public Guid PagoContratoId { get; set; }
    public ETipoCargo Tipo { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public bool Aplicado { get; set; }

    public PagoContrato? PagoContrato { get; set; }
    public ICollection<LineaPago> LineasPago { get; set; } = new List<LineaPago>();
}
