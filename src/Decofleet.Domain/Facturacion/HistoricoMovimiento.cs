namespace Decofleet.Domain.Facturacion;

/// <summary>Append-only audit log of balance movements. Never soft-deleted.</summary>
public sealed class HistoricoMovimiento : Common.BaseEntity
{
    public Guid EmpresaId { get; set; }
    /// <summary>Type of the related entity, e.g. "PagoContrato" or "Cargo".</summary>
    public string EntidadTipo { get; set; } = string.Empty;
    public Guid EntidadId { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public DateTimeOffset Fecha { get; set; }

    public Seguridad.Empresa? Empresa { get; set; }
}
