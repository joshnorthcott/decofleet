using Decofleet.Domain.Seguridad;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Seguridad;

public sealed class PermisoConfiguration : IEntityTypeConfiguration<Permiso>
{
    public void Configure(EntityTypeBuilder<Permiso> builder)
    {
        builder.ToTable("permisos");
        builder.Property(p => p.Clave).HasMaxLength(100).IsRequired();
        builder.Property(p => p.Descripcion).HasMaxLength(300).IsRequired();
        builder.HasIndex(p => p.Clave).IsUnique().HasDatabaseName("ix_permisos_clave");
    }
}
