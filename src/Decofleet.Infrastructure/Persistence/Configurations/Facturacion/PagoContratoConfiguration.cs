using Decofleet.Domain.Facturacion;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Facturacion;

public sealed class PagoContratoConfiguration : IEntityTypeConfiguration<PagoContrato>
{
    public void Configure(EntityTypeBuilder<PagoContrato> builder)
    {
        builder.ToTable("pagos_contrato");
        builder.Property(p => p.MontoTotal).HasColumnType("numeric(18,2)");
        builder.Property(p => p.Estatus).HasConversion<string>().HasMaxLength(50);
        builder.HasOne(p => p.Contrato).WithMany(c => c.Pagos).HasForeignKey(p => p.ContratoId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(p => p.EmpresaId).HasDatabaseName("ix_pagos_contrato_empresa_id");
        builder.HasIndex(p => p.ContratoId).HasDatabaseName("ix_pagos_contrato_contrato_id");
        builder.HasIndex(p => new { p.EmpresaId, p.Estatus }).HasDatabaseName("ix_pagos_contrato_empresa_id_estatus");
        builder.HasIndex(p => p.FechaVencimiento).HasDatabaseName("ix_pagos_contrato_fecha_vencimiento");
    }
}
