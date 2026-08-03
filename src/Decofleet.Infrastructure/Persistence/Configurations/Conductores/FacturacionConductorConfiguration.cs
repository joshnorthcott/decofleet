using Decofleet.Domain.Conductores;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Conductores;

public sealed class FacturacionConductorConfiguration : IEntityTypeConfiguration<FacturacionConductor>
{
    public void Configure(EntityTypeBuilder<FacturacionConductor> builder)
    {
        builder.ToTable("facturacion_conductores");
        builder.Property(f => f.Rfc).HasMaxLength(13);
        builder.Property(f => f.RazonSocial).HasMaxLength(300);
        builder.Property(f => f.RegimenFiscal).HasMaxLength(100);
        builder.Property(f => f.UsoCfdi).HasMaxLength(10);
        builder.HasOne(f => f.Conductor).WithOne(c => c.DatosFacturacion).HasForeignKey<FacturacionConductor>(f => f.ConductorId);
        builder.HasIndex(f => f.ConductorId).IsUnique().HasDatabaseName("ix_facturacion_conductores_conductor_id");
    }
}
