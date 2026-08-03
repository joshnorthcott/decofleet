using Decofleet.Domain.Conductores;
using Decofleet.Domain.Conductores.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Conductores;

public sealed class ConductorConfiguration : IEntityTypeConfiguration<Conductor>
{
    public void Configure(EntityTypeBuilder<Conductor> builder)
    {
        builder.ToTable("conductores");
        builder.Property(c => c.Nombre).HasMaxLength(100).IsRequired();
        builder.Property(c => c.ApellidoPaterno).HasMaxLength(100).IsRequired();
        builder.Property(c => c.ApellidoMaterno).HasMaxLength(100);
        builder.Property(c => c.Curp).HasMaxLength(18);
        builder.Property(c => c.Telefono).HasMaxLength(20);
        builder.Property(c => c.Email).HasMaxLength(200);
        builder.Property(c => c.Direccion).HasMaxLength(500);
        builder.Property(c => c.CodigoPostal).HasMaxLength(10);
        builder.Property(c => c.Estatus).HasConversion<string>().HasMaxLength(50);

        builder.HasIndex(c => c.EmpresaId).HasDatabaseName("ix_conductores_empresa_id");
        builder.HasIndex(c => new { c.EmpresaId, c.Estatus }).HasDatabaseName("ix_conductores_empresa_id_estatus");
    }
}
