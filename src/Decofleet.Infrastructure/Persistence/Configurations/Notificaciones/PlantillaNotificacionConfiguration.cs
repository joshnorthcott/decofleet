using Decofleet.Domain.Notificaciones;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Notificaciones;

public sealed class PlantillaNotificacionConfiguration : IEntityTypeConfiguration<PlantillaNotificacion>
{
    public void Configure(EntityTypeBuilder<PlantillaNotificacion> builder)
    {
        builder.ToTable("plantillas_notificacion");
        builder.Property(p => p.Nombre).HasMaxLength(200).IsRequired();
        builder.Property(p => p.Asunto).HasMaxLength(300);
        builder.Property(p => p.Tipo).HasConversion<string>().HasMaxLength(20);
        builder.Property(p => p.Variables).HasColumnType("jsonb");
        builder.HasIndex(p => p.EmpresaId).HasDatabaseName("ix_plantillas_notificacion_empresa_id");
    }
}
