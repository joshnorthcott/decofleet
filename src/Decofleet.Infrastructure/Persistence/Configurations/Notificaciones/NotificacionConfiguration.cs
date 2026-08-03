using Decofleet.Domain.Notificaciones;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Notificaciones;

public sealed class NotificacionConfiguration : IEntityTypeConfiguration<Notificacion>
{
    public void Configure(EntityTypeBuilder<Notificacion> builder)
    {
        builder.ToTable("notificaciones");
        builder.Property(n => n.Canal).HasConversion<string>().HasMaxLength(20);
        builder.Property(n => n.Estatus).HasConversion<string>().HasMaxLength(20);
        builder.Property(n => n.ErrorMsg).HasMaxLength(2000);
        builder.HasOne(n => n.Plantilla).WithMany(p => p.Notificaciones).HasForeignKey(n => n.PlantillaId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(n => n.EmpresaId).HasDatabaseName("ix_notificaciones_empresa_id");
        builder.HasIndex(n => new { n.EmpresaId, n.Estatus }).HasDatabaseName("ix_notificaciones_empresa_id_estatus");
    }
}
