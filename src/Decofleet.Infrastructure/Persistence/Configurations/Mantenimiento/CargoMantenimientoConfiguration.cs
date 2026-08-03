using Decofleet.Domain.Mantenimiento;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Mantenimiento;

public sealed class CargoMantenimientoConfiguration : IEntityTypeConfiguration<CargoMantenimiento>
{
    public void Configure(EntityTypeBuilder<CargoMantenimiento> builder)
    {
        builder.ToTable("cargos_mantenimiento");
        builder.Property(c => c.Descripcion).HasMaxLength(500).IsRequired();
        builder.Property(c => c.Monto).HasColumnType("numeric(18,2)");
        builder.HasOne(c => c.Mantenimiento).WithMany(m => m.Cargos).HasForeignKey(c => c.MantenimientoId);
        builder.HasIndex(c => c.MantenimientoId).HasDatabaseName("ix_cargos_mantenimiento_mantenimiento_id");
    }
}
