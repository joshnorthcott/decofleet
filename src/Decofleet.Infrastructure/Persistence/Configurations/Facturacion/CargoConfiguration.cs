using Decofleet.Domain.Facturacion;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Facturacion;

public sealed class CargoConfiguration : IEntityTypeConfiguration<Cargo>
{
    public void Configure(EntityTypeBuilder<Cargo> builder)
    {
        builder.ToTable("cargos");
        builder.Property(c => c.Tipo).HasConversion<string>().HasMaxLength(50);
        builder.Property(c => c.Descripcion).HasMaxLength(500).IsRequired();
        builder.Property(c => c.Monto).HasColumnType("numeric(18,2)");
        builder.HasOne(c => c.PagoContrato).WithMany(p => p.Cargos).HasForeignKey(c => c.PagoContratoId);
        builder.HasIndex(c => c.PagoContratoId).HasDatabaseName("ix_cargos_pago_contrato_id");
        builder.HasIndex(c => new { c.PagoContratoId, c.Aplicado }).HasDatabaseName("ix_cargos_pago_contrato_id_aplicado");
    }
}
