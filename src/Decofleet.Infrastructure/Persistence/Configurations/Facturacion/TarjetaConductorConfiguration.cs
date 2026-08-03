using Decofleet.Domain.Facturacion;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Facturacion;

public sealed class TarjetaConductorConfiguration : IEntityTypeConfiguration<TarjetaConductor>
{
    public void Configure(EntityTypeBuilder<TarjetaConductor> builder)
    {
        builder.ToTable("tarjetas_conductor");
        builder.Property(t => t.Last4).HasMaxLength(4).IsRequired();
        builder.Property(t => t.Marca).HasMaxLength(50);
        builder.Property(t => t.TokenGateway).HasMaxLength(500).IsRequired();
        builder.HasIndex(t => t.ConductorId).HasDatabaseName("ix_tarjetas_conductor_conductor_id");
    }
}
