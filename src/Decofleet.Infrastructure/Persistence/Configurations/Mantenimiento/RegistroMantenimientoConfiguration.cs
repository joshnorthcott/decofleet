using Decofleet.Domain.Mantenimiento;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Mantenimiento;

public sealed class RegistroMantenimientoConfiguration : IEntityTypeConfiguration<RegistroMantenimiento>
{
    public void Configure(EntityTypeBuilder<RegistroMantenimiento> builder)
    {
        builder.ToTable("registros_mantenimiento");
        builder.Property(r => r.Descripcion).HasMaxLength(2000).IsRequired();
        builder.HasOne(r => r.Mantenimiento).WithMany(m => m.Registros).HasForeignKey(r => r.MantenimientoId);
        builder.HasIndex(r => r.MantenimientoId).HasDatabaseName("ix_registros_mantenimiento_mantenimiento_id");
    }
}
