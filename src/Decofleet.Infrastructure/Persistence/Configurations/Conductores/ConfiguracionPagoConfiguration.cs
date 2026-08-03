using Decofleet.Domain.Conductores;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Conductores;

public sealed class ConfiguracionPagoConfiguration : IEntityTypeConfiguration<ConfiguracionPago>
{
    public void Configure(EntityTypeBuilder<ConfiguracionPago> builder)
    {
        builder.ToTable("configuraciones_pago");
        builder.Property(cp => cp.Tipo).HasMaxLength(100);
        builder.Property(cp => cp.Monto).HasColumnType("numeric(18,2)");
        builder.Property(cp => cp.CuentaPago).HasConversion<string>().HasMaxLength(50);
        builder.HasOne(cp => cp.Conductor).WithOne(c => c.ConfiguracionPago).HasForeignKey<ConfiguracionPago>(cp => cp.ConductorId);
        builder.HasIndex(cp => cp.ConductorId).IsUnique().HasDatabaseName("ix_configuraciones_pago_conductor_id");
    }
}
