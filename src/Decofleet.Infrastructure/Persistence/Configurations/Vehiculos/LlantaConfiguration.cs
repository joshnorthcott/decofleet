using Decofleet.Domain.Vehiculos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Vehiculos;

public sealed class LlantaConfiguration : IEntityTypeConfiguration<Llanta>
{
    public void Configure(EntityTypeBuilder<Llanta> builder)
    {
        builder.ToTable("llantas");
        builder.Property(l => l.Posicion).HasConversion<string>().HasMaxLength(50);
        builder.Property(l => l.Marca).HasMaxLength(100);
        builder.Property(l => l.Medida).HasMaxLength(30);
        builder.Property(l => l.Dot).HasMaxLength(20);
        builder.HasOne(l => l.Vehiculo).WithMany(v => v.Llantas).HasForeignKey(l => l.VehiculoId);
        builder.HasIndex(l => l.VehiculoId).HasDatabaseName("ix_llantas_vehiculo_id");
    }
}
