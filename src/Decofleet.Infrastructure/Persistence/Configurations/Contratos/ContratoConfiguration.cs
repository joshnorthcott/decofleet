using Decofleet.Domain.Contratos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Contratos;

public sealed class ContratoConfiguration : IEntityTypeConfiguration<Contrato>
{
    public void Configure(EntityTypeBuilder<Contrato> builder)
    {
        builder.ToTable("contratos");
        builder.Property(c => c.Estatus).HasConversion<string>().HasMaxLength(50);
        builder.Property(c => c.FormaPago).HasConversion<string>().HasMaxLength(50);
        builder.Property(c => c.Observaciones).HasMaxLength(2000);

        builder.HasOne(c => c.Conductor).WithMany().HasForeignKey(c => c.ConductorId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(c => c.Vehiculo).WithMany().HasForeignKey(c => c.VehiculoId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(c => c.Tarifa).WithMany(t => t.Contratos).HasForeignKey(c => c.TarifaId).OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(c => c.EmpresaId).HasDatabaseName("ix_contratos_empresa_id");
        builder.HasIndex(c => new { c.EmpresaId, c.Estatus }).HasDatabaseName("ix_contratos_empresa_id_estatus");
        builder.HasIndex(c => c.ConductorId).HasDatabaseName("ix_contratos_conductor_id");
        builder.HasIndex(c => c.VehiculoId).HasDatabaseName("ix_contratos_vehiculo_id");
    }
}
