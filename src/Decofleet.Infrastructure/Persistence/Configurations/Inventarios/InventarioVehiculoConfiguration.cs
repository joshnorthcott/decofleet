using Decofleet.Domain.Inventarios;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Inventarios;

public sealed class InventarioVehiculoConfiguration : IEntityTypeConfiguration<InventarioVehiculo>
{
    public void Configure(EntityTypeBuilder<InventarioVehiculo> builder)
    {
        builder.ToTable("inventarios");
        builder.Property(i => i.Observaciones).HasMaxLength(2000);
        builder.Property(i => i.Metadata).HasColumnType("jsonb");
        builder.HasIndex(i => i.EmpresaId).HasDatabaseName("ix_inventarios_empresa_id");
        builder.HasIndex(i => i.VehiculoId).HasDatabaseName("ix_inventarios_vehiculo_id");
        builder.HasIndex(i => i.ConductorId).HasDatabaseName("ix_inventarios_conductor_id");
        builder.HasIndex(i => i.Fecha).HasDatabaseName("ix_inventarios_fecha");
    }
}
