using Decofleet.Domain.Seguridad;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Decofleet.Infrastructure.Persistence.Configurations.Seguridad;

public sealed class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("refresh_tokens");
        builder.Property(t => t.TokenHash).HasMaxLength(500).IsRequired();
        builder.HasIndex(t => t.TokenHash).HasDatabaseName("ix_refresh_tokens_token_hash");
        builder.HasIndex(t => t.UsuarioId).HasDatabaseName("ix_refresh_tokens_usuario_id");
        builder.HasOne(t => t.Usuario).WithMany(u => u.RefreshTokens).HasForeignKey(t => t.UsuarioId);
        // Computed properties should not be mapped to columns
        builder.Ignore(t => t.IsExpired);
        builder.Ignore(t => t.IsRevoked);
        builder.Ignore(t => t.IsActive);
    }
}
