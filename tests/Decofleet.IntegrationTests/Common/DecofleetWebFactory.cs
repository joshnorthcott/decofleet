using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Testcontainers.PostgreSql;
using Decofleet.Infrastructure.Persistence;

namespace Decofleet.IntegrationTests.Common;

/// <summary>
/// Spins up a real PostgreSQL instance via Testcontainers for integration tests.
/// </summary>
public sealed class DecofleetWebFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder()
        .WithDatabase("decofleet_test")
        .WithUsername("postgres")
        .WithPassword("test_password")
        .Build();

    public async Task InitializeAsync()
    {
        await _postgres.StartAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Replace the real DB with the test container
            services.RemoveAll<DbContextOptions<DecofleetDbContext>>();
            services.AddDbContext<DecofleetDbContext>(opts =>
                opts.UseNpgsql(_postgres.GetConnectionString())
                    .UseSnakeCaseNamingConvention());

            // Apply migrations to the test database
            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DecofleetDbContext>();
            db.Database.Migrate();
        });

        builder.UseEnvironment("Test");
    }

    public new async Task DisposeAsync()
    {
        await _postgres.StopAsync();
        await base.DisposeAsync();
    }
}
