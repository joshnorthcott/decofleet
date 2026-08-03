using Decofleet.Domain.Contratos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Contratos;

public sealed class TarifaConfiguration : IEntityTypeConfiguration<Tarifa>
{
    public void Configure(EntityTypeBuilder<Tarifa> builder)
    {
        builder.ToTable("tarifas");
        builder.Property(t => t.Nombre).HasMaxLength(200).IsRequired();
        builder.Property(t => t.Descripcion).HasMaxLength(1000);
        builder.Property(t => t.MontoRenta).HasColumnType("numeric(18,2)");
        builder.Property(t => t.MontoActivacion).HasColumnType("numeric(18,2)");
        builder.Property(t => t.Periodicidad).HasConversion<string>().HasMaxLength(50);
        builder.Property(t => t.FormaPago).HasConversion<string>().HasMaxLength(50);
        builder.HasIndex(t => t.EmpresaId).HasDatabaseName("ix_tarifas_empresa_id");
    }
}
