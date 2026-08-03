using Decofleet.Domain.Seguridad;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Seguridad;

public sealed class RolPermisoConfiguration : IEntityTypeConfiguration<RolPermiso>
{
    public void Configure(EntityTypeBuilder<RolPermiso> builder)
    {
        builder.ToTable("roles_permisos");
        builder.HasKey(rp => new { rp.RolId, rp.PermisoId });
        builder.HasOne(rp => rp.Rol).WithMany(r => r.RolPermisos).HasForeignKey(rp => rp.RolId);
        builder.HasOne(rp => rp.Permiso).WithMany(p => p.RolPermisos).HasForeignKey(rp => rp.PermisoId);
    }
}
