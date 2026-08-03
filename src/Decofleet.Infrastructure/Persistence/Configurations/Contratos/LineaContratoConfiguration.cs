using Decofleet.Domain.Contratos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Contratos;

public sealed class LineaContratoConfiguration : IEntityTypeConfiguration<LineaContrato>
{
    public void Configure(EntityTypeBuilder<LineaContrato> builder)
    {
        builder.ToTable("lineas_contrato");
        builder.Property(l => l.Tipo).HasMaxLength(100).IsRequired();
        builder.Property(l => l.Descripcion).HasMaxLength(500).IsRequired();
        builder.Property(l => l.Monto).HasColumnType("numeric(18,2)");
        builder.HasOne(l => l.Contrato).WithMany(c => c.Lineas).HasForeignKey(l => l.ContratoId);
        builder.HasIndex(l => l.ContratoId).HasDatabaseName("ix_lineas_contrato_contrato_id");
    }
}
