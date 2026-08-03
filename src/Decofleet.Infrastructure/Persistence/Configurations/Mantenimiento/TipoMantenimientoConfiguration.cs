using Decofleet.Domain.Mantenimiento;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Mantenimiento;

public sealed class TipoMantenimientoConfiguration : IEntityTypeConfiguration<TipoMantenimiento>
{
    public void Configure(EntityTypeBuilder<TipoMantenimiento> builder)
    {
        builder.ToTable("tipos_mantenimiento");
        builder.Property(t => t.Nombre).HasMaxLength(200).IsRequired();
        builder.Property(t => t.Descripcion).HasMaxLength(1000);
        builder.HasIndex(t => t.EmpresaId).HasDatabaseName("ix_tipos_mantenimiento_empresa_id");
        builder.HasIndex(t => new { t.EmpresaId, t.EsSiniestro }).HasDatabaseName("ix_tipos_mantenimiento_empresa_id_es_siniestro");
    }
}
