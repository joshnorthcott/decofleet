using Decofleet.Application.Common.Interfaces;
using Decofleet.Infrastructure.Persistence;
using Decofleet.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Decofleet.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        // ── EF Core ───────────────────────────────────────────
        services.AddDbContext<DecofleetDbContext>((sp, options) =>
        {
            options
                .UseNpgsql(connectionString, npgsql =>
                {
                    npgsql.MigrationsAssembly(typeof(DecofleetDbContext).Assembly.FullName);
                    npgsql.EnableRetryOnFailure(maxRetryCount: 3);
                })
                .UseSnakeCaseNamingConvention();
        });
        services.AddScoped<IDecofleetDbContext>(sp => sp.GetRequiredService<DecofleetDbContext>());

        // ── HTTP context (needed by tenant + current-user services) ───
        services.AddHttpContextAccessor();

        // ── Tenant + current-user ─────────────────────────────
        services.AddScoped<ITenantContext, HttpTenantContext>();
        services.AddScoped<ICurrentUserService, HttpCurrentUserService>();

        // ── Auth services ─────────────────────────────────────
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();

        var jwtSection = configuration.GetSection(JwtSettings.SectionName);
        services.Configure<JwtSettings>(jwtSection);
        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();

        // ── JWT bearer authentication ─────────────────────────
        var jwtSettings = jwtSection.Get<JwtSettings>()
            ?? throw new InvalidOperationException("Jwt settings not configured.");

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opts =>
            {
                opts.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
                    ClockSkew = TimeSpan.FromSeconds(30),
                };
            });

        services.AddAuthorization();

        // ── Seeder (registered for CLI use: dotnet run -- --seed) ─
        services.AddScoped<DbSeeder>();

        return services;
    }
}
