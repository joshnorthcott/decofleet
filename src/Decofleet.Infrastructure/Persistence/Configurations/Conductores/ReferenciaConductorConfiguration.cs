using Decofleet.Domain.Conductores;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Conductores;

public sealed class ReferenciaConductorConfiguration : IEntityTypeConfiguration<ReferenciaConductor>
{
    public void Configure(EntityTypeBuilder<ReferenciaConductor> builder)
    {
        builder.ToTable("referencias_conductor");
        builder.Property(r => r.Nombre).HasMaxLength(150).IsRequired();
        builder.Property(r => r.Telefono).HasMaxLength(20);
        builder.Property(r => r.Relacion).HasMaxLength(100);
        builder.HasOne(r => r.Conductor).WithMany(c => c.Referencias).HasForeignKey(r => r.ConductorId);
        builder.HasIndex(r => r.ConductorId).HasDatabaseName("ix_referencias_conductor_conductor_id");
    }
}
