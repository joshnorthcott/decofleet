using Decofleet.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Decofleet.Infrastructure.Persistence;

/// <summary>
/// Used by <c>dotnet ef</c> CLI at design time (migrations, scaffolding).
/// Run from the solution root:
///   dotnet ef migrations add InitialCreate --project src/Decofleet.Infrastructure --startup-project src/Decofleet.Api
/// </summary>
public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<DecofleetDbContext>
{
    public DecofleetDbContext CreateDbContext(string[] args)
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "src", "Decofleet.Api"))
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = config.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "Set ConnectionStrings:DefaultConnection via dotnet user-secrets or env var before running migrations.");

        var optionsBuilder = new DbContextOptionsBuilder<DecofleetDbContext>();
        optionsBuilder
            .UseNpgsql(connectionString, b =>
                b.MigrationsAssembly(typeof(DecofleetDbContext).Assembly.FullName))
            .UseSnakeCaseNamingConvention();

        return new DecofleetDbContext(optionsBuilder.Options, new DesignTimeTenantContext());
    }

    // Stub tenant context — global query filters are suppressed at design time
    private sealed class DesignTimeTenantContext : ITenantContext
    {
        public Guid EmpresaId => Guid.Empty;
    }
}
