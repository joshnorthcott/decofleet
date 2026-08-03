using Decofleet.Domain.Seguridad;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Seguridad;

public sealed class EmpresaConfiguration : IEntityTypeConfiguration<Empresa>
{
    public void Configure(EntityTypeBuilder<Empresa> builder)
    {
        builder.ToTable("empresas");
        builder.Property(e => e.Nombre).HasMaxLength(200).IsRequired();
        builder.Property(e => e.Rfc).HasMaxLength(13);
        builder.Property(e => e.Telefono).HasMaxLength(20);
        builder.Property(e => e.LogoUrl).HasMaxLength(500);
        builder.Property(e => e.Config).HasColumnType("jsonb");
    }
}
