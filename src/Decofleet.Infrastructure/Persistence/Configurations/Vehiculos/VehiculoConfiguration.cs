using Decofleet.Domain.Vehiculos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Vehiculos;

public sealed class VehiculoConfiguration : IEntityTypeConfiguration<Vehiculo>
{
    public void Configure(EntityTypeBuilder<Vehiculo> builder)
    {
        builder.ToTable("vehiculos");
        builder.Property(v => v.Marca).HasMaxLength(100).IsRequired();
        builder.Property(v => v.Modelo).HasMaxLength(100).IsRequired();
        builder.Property(v => v.Placas).HasMaxLength(20);
        builder.Property(v => v.Vin).HasMaxLength(17);
        builder.Property(v => v.Color).HasMaxLength(50);
        builder.Property(v => v.Telefono).HasMaxLength(20);
        builder.Property(v => v.Estatus).HasConversion<string>().HasMaxLength(50);

        builder.HasIndex(v => v.EmpresaId).HasDatabaseName("ix_vehiculos_empresa_id");
        builder.HasIndex(v => new { v.EmpresaId, v.Estatus }).HasDatabaseName("ix_vehiculos_empresa_id_estatus");
        builder.HasIndex(v => v.Placas).HasDatabaseName("ix_vehiculos_placas");
    }
}
