using Decofleet.Domain.Seguridad;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Seguridad;

public sealed class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.ToTable("usuarios");
        builder.Property(u => u.Email).HasMaxLength(200).IsRequired();
        builder.Property(u => u.PasswordHash).HasMaxLength(500).IsRequired();
        builder.Property(u => u.Nombre).HasMaxLength(100).IsRequired();
        builder.Property(u => u.Apellido).HasMaxLength(100);

        builder.HasIndex(u => new { u.EmpresaId, u.Email })
            .IsUnique()
            .HasDatabaseName("ix_usuarios_empresa_id_email");

        builder.HasOne(u => u.Empresa).WithMany(e => e.Usuarios).HasForeignKey(u => u.EmpresaId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(u => u.Rol).WithMany(r => r.Usuarios).HasForeignKey(u => u.RolId).OnDelete(DeleteBehavior.Restrict);
    }
}
