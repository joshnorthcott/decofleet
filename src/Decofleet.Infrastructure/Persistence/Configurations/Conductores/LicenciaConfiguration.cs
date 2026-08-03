using Decofleet.Domain.Conductores;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Conductores;

public sealed class LicenciaConfiguration : IEntityTypeConfiguration<Licencia>
{
    public void Configure(EntityTypeBuilder<Licencia> builder)
    {
        builder.ToTable("licencias");
        builder.Property(l => l.Tipo).HasConversion<string>().HasMaxLength(10);
        builder.Property(l => l.Numero).HasMaxLength(50).IsRequired();
        builder.HasOne(l => l.Conductor).WithMany(c => c.Licencias).HasForeignKey(l => l.ConductorId);
        builder.HasIndex(l => l.ConductorId).HasDatabaseName("ix_licencias_conductor_id");
    }
}
