using Decofleet.Domain.Facturacion;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Facturacion;

public sealed class PagoEmitidoConfiguration : IEntityTypeConfiguration<PagoEmitido>
{
    public void Configure(EntityTypeBuilder<PagoEmitido> builder)
    {
        builder.ToTable("pagos_emitidos");
        builder.Property(p => p.Monto).HasColumnType("numeric(18,2)");
        builder.Property(p => p.FormaPago).HasConversion<string>().HasMaxLength(50);
        builder.Property(p => p.Referencia).HasMaxLength(200);
        builder.Property(p => p.TicketUrl).HasMaxLength(500);
        builder.HasOne(p => p.PagoContrato).WithMany(pc => pc.PagosEmitidos).HasForeignKey(p => p.PagoContratoId);
        builder.HasIndex(p => p.PagoContratoId).HasDatabaseName("ix_pagos_emitidos_pago_contrato_id");
        builder.HasIndex(p => p.EmpresaId).HasDatabaseName("ix_pagos_emitidos_empresa_id");
        builder.HasIndex(p => p.FechaPago).HasDatabaseName("ix_pagos_emitidos_fecha_pago");
    }
}
