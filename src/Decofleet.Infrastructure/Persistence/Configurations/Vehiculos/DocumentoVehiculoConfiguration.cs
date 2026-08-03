using Decofleet.Domain.Vehiculos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Vehiculos;

public sealed class DocumentoVehiculoConfiguration : IEntityTypeConfiguration<DocumentoVehiculo>
{
    public void Configure(EntityTypeBuilder<DocumentoVehiculo> builder)
    {
        builder.ToTable("documentos_vehiculo");
        builder.Property(d => d.Nombre).HasMaxLength(300).IsRequired();
        builder.Property(d => d.Categoria).HasConversion<string>().HasMaxLength(50);
        builder.Property(d => d.S3Key).HasMaxLength(500).IsRequired();
        builder.Property(d => d.S3Url).HasMaxLength(1000);
        builder.Property(d => d.MimeType).HasMaxLength(100);
        builder.HasOne(d => d.Vehiculo).WithMany(v => v.Documentos).HasForeignKey(d => d.VehiculoId);
        builder.HasIndex(d => d.VehiculoId).HasDatabaseName("ix_documentos_vehiculo_vehiculo_id");
    }
}
