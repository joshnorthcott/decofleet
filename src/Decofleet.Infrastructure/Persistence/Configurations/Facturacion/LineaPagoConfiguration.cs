using Decofleet.Domain.Facturacion;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Facturacion;

public sealed class LineaPagoConfiguration : IEntityTypeConfiguration<LineaPago>
{
    public void Configure(EntityTypeBuilder<LineaPago> builder)
    {
        builder.ToTable("lineas_pago");
        builder.Property(l => l.MontoAplicado).HasColumnType("numeric(18,2)");
        builder.HasOne(l => l.PagoEmitido).WithMany(p => p.LineasPago).HasForeignKey(l => l.PagoEmitidoId);
        builder.HasOne(l => l.Cargo).WithMany(c => c.LineasPago).HasForeignKey(l => l.CargoId);
        builder.HasIndex(l => l.PagoEmitidoId).HasDatabaseName("ix_lineas_pago_pago_emitido_id");
        builder.HasIndex(l => l.CargoId).HasDatabaseName("ix_lineas_pago_cargo_id");
    }
}
