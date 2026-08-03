using Decofleet.Domain.Inventarios;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Inventarios;

public sealed class DocumentoInventarioConfiguration : IEntityTypeConfiguration<DocumentoInventario>
{
    public void Configure(EntityTypeBuilder<DocumentoInventario> builder)
    {
        builder.ToTable("documentos_inventario");
        builder.Property(d => d.Nombre).HasMaxLength(300).IsRequired();
        builder.Property(d => d.S3Key).HasMaxLength(500).IsRequired();
        builder.Property(d => d.S3Url).HasMaxLength(1000);
        builder.HasOne(d => d.Inventario).WithMany(i => i.Documentos).HasForeignKey(d => d.InventarioId);
        builder.HasIndex(d => d.InventarioId).HasDatabaseName("ix_documentos_inventario_inventario_id");
    }
}
