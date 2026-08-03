using Decofleet.Domain.Vehiculos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Vehiculos;

public sealed class VehiculoSeguroConfiguration : IEntityTypeConfiguration<VehiculoSeguro>
{
    public void Configure(EntityTypeBuilder<VehiculoSeguro> builder)
    {
        builder.ToTable("vehiculo_seguros");
        builder.Property(s => s.Aseguradora).HasMaxLength(200).IsRequired();
        builder.Property(s => s.NumPoliza).HasMaxLength(100).IsRequired();
        builder.Property(s => s.TipoPoliza).HasConversion<string>().HasMaxLength(50);
        builder.Property(s => s.Monto).HasColumnType("numeric(18,2)");
        builder.Property(s => s.Comentarios).HasMaxLength(1000);
        builder.HasOne(s => s.Vehiculo).WithMany(v => v.Seguros).HasForeignKey(s => s.VehiculoId);
        builder.HasIndex(s => s.VehiculoId).HasDatabaseName("ix_vehiculo_seguros_vehiculo_id");
        builder.HasIndex(s => s.VigenciaFin).HasDatabaseName("ix_vehiculo_seguros_vigencia_fin");
    }
}
