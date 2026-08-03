using Decofleet.Application.Common.Interfaces;
using Decofleet.Domain.Contratos;
using Decofleet.Domain.Contratos.Enums;
using Decofleet.Domain.Seguridad;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Decofleet.Infrastructure.Persistence;

/// <summary>
/// Idempotent seeder — safe to run multiple times.
/// Invoked via: dotnet run --project src/Decofleet.Api -- --seed
/// </summary>
public sealed class DbSeeder
{
    // Well-known fixed GUIDs so re-runs are idempotent
    private static readonly Guid SeedEmpresaId  = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private static readonly Guid RolAdminId      = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000001");
    private static readonly Guid RolOperadorId   = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000002");
    private static readonly Guid RolVisualizadorId = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000003");

    private readonly DecofleetDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly ILogger<DbSeeder> _logger;

    public DbSeeder(
        DecofleetDbContext db,
        IPasswordHasher hasher,
        ILogger<DbSeeder> logger)
    {
        _db     = db;
        _hasher = hasher;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken ct = default)
    {
        _logger.LogInformation("Starting database seed...");

        await SeedEmpresaAsync(ct);
        await SeedRolesAsync(ct);
        await SeedTarifasAsync(ct);
        await SeedAdminUsuarioAsync(ct);

        _logger.LogInformation("Database seed completed successfully.");
    }

    // ── Empresa ──────────────────────────────────────────────────────────────
    private async Task SeedEmpresaAsync(CancellationToken ct)
    {
        var exists = await _db.Empresas
            .IgnoreQueryFilters()
            .AnyAsync(e => e.Id == SeedEmpresaId, ct);

        if (exists)
        {
            _logger.LogDebug("Empresa already seeded — skipping.");
            return;
        }

        var empresa = new Empresa
        {
            Nombre   = "Decofleet Demo",
            Rfc      = "DFD240101AAA",
            Telefono = "5550000000",
        };

        // Set the known ID via reflection (Id is protected set)
        SetId(empresa, SeedEmpresaId);

        _db.Empresas.Add(empresa);
        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Empresa '{Nombre}' created (Id={Id}).", empresa.Nombre, empresa.Id);
    }

    // ── Roles ─────────────────────────────────────────────────────────────────
    private async Task SeedRolesAsync(CancellationToken ct)
    {
        var existingIds = await _db.Roles
            .IgnoreQueryFilters()
            .Where(r => r.EmpresaId == SeedEmpresaId)
            .Select(r => r.Id)
            .ToListAsync(ct);

        var toAdd = new List<Rol>();

        void AddIfMissing(Guid id, string nombre, string descripcion)
        {
            if (existingIds.Contains(id)) return;
            var rol = new Rol { EmpresaId = SeedEmpresaId, Nombre = nombre, Descripcion = descripcion };
            SetId(rol, id);
            toAdd.Add(rol);
        }

        AddIfMissing(RolAdminId,        "Admin",        "Acceso total al sistema");
        AddIfMissing(RolOperadorId,     "Operador",     "Gestión de conductores, vehículos y contratos");
        AddIfMissing(RolVisualizadorId, "Visualizador", "Acceso de solo lectura");

        if (toAdd.Count == 0)
        {
            _logger.LogDebug("Roles already seeded — skipping.");
            return;
        }

        _db.Roles.AddRange(toAdd);
        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} role(s).", toAdd.Count);
    }

    // ── Tarifas ──────────────────────────────────────────────────────────────
    private async Task SeedTarifasAsync(CancellationToken ct)
    {
        var exists = await _db.Tarifas
            .IgnoreQueryFilters()
            .AnyAsync(t => t.EmpresaId == SeedEmpresaId, ct);

        if (exists)
        {
            _logger.LogDebug("Tarifas already seeded — skipping.");
            return;
        }

        var tarifas = new List<Tarifa>
        {
            new() { EmpresaId = SeedEmpresaId, Nombre = "Tarifa Económica", MontoRenta = 2800m, MontoActivacion = 500m,  Periodicidad = EPeriodicidad.Mensual,   FormaPago = EFormaPago.Efectivo       },
            new() { EmpresaId = SeedEmpresaId, Nombre = "Tarifa Estándar",  MontoRenta = 3500m, MontoActivacion = 800m,  Periodicidad = EPeriodicidad.Mensual,   FormaPago = EFormaPago.Transferencia  },
            new() { EmpresaId = SeedEmpresaId, Nombre = "Tarifa Plus",      MontoRenta = 4800m, MontoActivacion = 1200m, Periodicidad = EPeriodicidad.Mensual,   FormaPago = EFormaPago.Transferencia  },
            new() { EmpresaId = SeedEmpresaId, Nombre = "Tarifa Semanal",   MontoRenta = 1000m, MontoActivacion = 300m,  Periodicidad = EPeriodicidad.Semanal,   FormaPago = EFormaPago.Efectivo       },
            new() { EmpresaId = SeedEmpresaId, Nombre = "Tarifa Quincenal", MontoRenta = 1800m, MontoActivacion = 500m,  Periodicidad = EPeriodicidad.Quincenal, FormaPago = EFormaPago.Efectivo       },
        };

        _db.Tarifas.AddRange(tarifas);
        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} tarifa(s).", tarifas.Count);
    }

    // ── Admin usuario ────────────────────────────────────────────────────────
    private async Task SeedAdminUsuarioAsync(CancellationToken ct)
    {
        const string adminEmail = "admin@decofleet.mx";

        var exists = await _db.Usuarios
            .IgnoreQueryFilters()
            .AnyAsync(u => u.Email == adminEmail, ct);

        if (exists)
        {
            _logger.LogDebug("Admin user already seeded — skipping.");
            return;
        }

        // Password sourced from SEED_ADMIN_PASSWORD env var; falls back to a
        // random default that is printed to the log so you can copy it.
        var rawPassword = Environment.GetEnvironmentVariable("SEED_ADMIN_PASSWORD")
            ?? GenerateRandomPassword();

        var usuario = new Usuario
        {
            EmpresaId    = SeedEmpresaId,
            Email        = adminEmail,
            PasswordHash = _hasher.Hash(rawPassword),
            Nombre       = "Admin",
            Apellido     = "Sistema",
            RolId        = RolAdminId,
            Activo       = true,
        };

        _db.Usuarios.Add(usuario);
        await _db.SaveChangesAsync(ct);

        _logger.LogWarning(
            "Admin user created: email={Email}  password={Password}  — change this immediately!",
            adminEmail, rawPassword);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    private static void SetId(Domain.Common.BaseEntity entity, Guid id)
    {
        var prop = typeof(Domain.Common.BaseEntity)
            .GetProperty(nameof(Domain.Common.BaseEntity.Id))!;
        prop.SetValue(entity, id);
    }

    private static string GenerateRandomPassword()
        => Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(18))
           .Replace("+", "-").Replace("/", "_").TrimEnd('=');
}
