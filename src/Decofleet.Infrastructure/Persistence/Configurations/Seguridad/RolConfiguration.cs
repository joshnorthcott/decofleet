using Decofleet.Domain.Seguridad;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Seguridad;

public sealed class RolConfiguration : IEntityTypeConfiguration<Rol>
{
    public void Configure(EntityTypeBuilder<Rol> builder)
    {
        builder.ToTable("roles");
        builder.Property(r => r.Nombre).HasMaxLength(100).IsRequired();
        builder.Property(r => r.Descripcion).HasMaxLength(500);

        builder.HasOne(r => r.Empresa).WithMany(e => e.Roles).HasForeignKey(r => r.EmpresaId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(r => r.EmpresaId).HasDatabaseName("ix_roles_empresa_id");
    }
}
