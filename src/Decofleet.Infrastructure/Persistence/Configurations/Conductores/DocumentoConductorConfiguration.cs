using Decofleet.Domain.Conductores;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Conductores;

public sealed class DocumentoConductorConfiguration : IEntityTypeConfiguration<DocumentoConductor>
{
    public void Configure(EntityTypeBuilder<DocumentoConductor> builder)
    {
        builder.ToTable("documentos_conductor");
        builder.Property(d => d.Nombre).HasMaxLength(300).IsRequired();
        builder.Property(d => d.Categoria).HasConversion<string>().HasMaxLength(50);
        builder.Property(d => d.S3Key).HasMaxLength(500).IsRequired();
        builder.Property(d => d.S3Url).HasMaxLength(1000);
        builder.Property(d => d.MimeType).HasMaxLength(100);
        builder.HasOne(d => d.Conductor).WithMany(c => c.Documentos).HasForeignKey(d => d.ConductorId);
        builder.HasIndex(d => d.ConductorId).HasDatabaseName("ix_documentos_conductor_conductor_id");
        builder.HasIndex(d => d.EmpresaId).HasDatabaseName("ix_documentos_conductor_empresa_id");
    }
}
