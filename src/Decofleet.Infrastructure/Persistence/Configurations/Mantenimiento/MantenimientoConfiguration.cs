using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Mantenimiento;

public sealed class MantenimientoConfiguration : IEntityTypeConfiguration<Domain.Mantenimiento.Mantenimiento>
{
    public void Configure(EntityTypeBuilder<Domain.Mantenimiento.Mantenimiento> builder)
    {
        builder.ToTable("mantenimientos");
        builder.Property(m => m.Estatus).HasConversion<string>().HasMaxLength(50);
        builder.Property(m => m.Proveedor).HasMaxLength(300);
        builder.Property(m => m.CostoEstimado).HasColumnType("numeric(18,2)");
        builder.Property(m => m.CostoReal).HasColumnType("numeric(18,2)");

        builder.HasOne(m => m.TipoMantenimiento).WithMany(t => t.Mantenimientos).HasForeignKey(m => m.TipoMantenimientoId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(m => m.Vehiculo).WithMany().HasForeignKey(m => m.VehiculoId).OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(m => m.EmpresaId).HasDatabaseName("ix_mantenimientos_empresa_id");
        builder.HasIndex(m => m.VehiculoId).HasDatabaseName("ix_mantenimientos_vehiculo_id");
        builder.HasIndex(m => new { m.EmpresaId, m.Estatus }).HasDatabaseName("ix_mantenimientos_empresa_id_estatus");
        builder.HasIndex(m => m.FechaProgramada).HasDatabaseName("ix_mantenimientos_fecha_programada");
    }
}
