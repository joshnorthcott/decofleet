using Decofleet.Domain.Mantenimiento;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Mantenimiento;

public sealed class DocumentoMantenimientoConfiguration : IEntityTypeConfiguration<DocumentoMantenimiento>
{
    public void Configure(EntityTypeBuilder<DocumentoMantenimiento> builder)
    {
        builder.ToTable("documentos_mantenimiento");
        builder.Property(d => d.Nombre).HasMaxLength(300).IsRequired();
        builder.Property(d => d.S3Key).HasMaxLength(500).IsRequired();
        builder.Property(d => d.S3Url).HasMaxLength(1000);
        builder.HasOne(d => d.Mantenimiento).WithMany(m => m.Documentos).HasForeignKey(d => d.MantenimientoId);
        builder.HasIndex(d => d.MantenimientoId).HasDatabaseName("ix_documentos_mantenimiento_mantenimiento_id");
    }
}
