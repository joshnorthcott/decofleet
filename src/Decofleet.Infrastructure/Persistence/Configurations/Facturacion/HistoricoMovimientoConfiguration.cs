using Decofleet.Domain.Facturacion;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Facturacion;

public sealed class HistoricoMovimientoConfiguration : IEntityTypeConfiguration<HistoricoMovimiento>
{
    public void Configure(EntityTypeBuilder<HistoricoMovimiento> builder)
    {
        builder.ToTable("historico_movimientos");
        builder.Property(h => h.EntidadTipo).HasMaxLength(100).IsRequired();
        builder.Property(h => h.Descripcion).HasMaxLength(500).IsRequired();
        builder.Property(h => h.Monto).HasColumnType("numeric(18,2)");
        builder.HasIndex(h => h.EmpresaId).HasDatabaseName("ix_historico_movimientos_empresa_id");
        builder.HasIndex(h => new { h.EmpresaId, h.Fecha }).HasDatabaseName("ix_historico_movimientos_empresa_id_fecha");
        builder.HasIndex(h => new { h.EntidadTipo, h.EntidadId }).HasDatabaseName("ix_historico_movimientos_entidad");
    }
}
