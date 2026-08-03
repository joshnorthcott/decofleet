using System.Linq.Expressions;
using Decofleet.Application.Common.Interfaces;
using Decofleet.Domain.Conductores;
using Decofleet.Domain.Contratos;
using Decofleet.Domain.Facturacion;
using Decofleet.Domain.Inventarios;
using Decofleet.Domain.Mantenimiento;
using Decofleet.Domain.Notificaciones;
using Decofleet.Domain.Seguridad;
using Decofleet.Domain.Vehiculos;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Infrastructure.Persistence;

public sealed class DecofleetDbContext : DbContext, IDecofleetDbContext
{
    private readonly ITenantContext _tenant;

    public DecofleetDbContext(DbContextOptions<DecofleetDbContext> options, ITenantContext tenant)
        : base(options) => _tenant = tenant;

    // ── Seguridad ─────────────────────────────────────────────
    public DbSet<Empresa> Empresas => Set<Empresa>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Rol> Roles => Set<Rol>();
    public DbSet<Permiso> Permisos => Set<Permiso>();
    public DbSet<RolPermiso> RolPermisos => Set<RolPermiso>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    // ── Conductores ───────────────────────────────────────────
    public DbSet<Conductor> Conductores => Set<Conductor>();
    public DbSet<Licencia> Licencias => Set<Licencia>();
    public DbSet<ReferenciaConductor> ReferenciasConductor => Set<ReferenciaConductor>();
    public DbSet<ConfiguracionPago> ConfiguracionesPago => Set<ConfiguracionPago>();
    public DbSet<FacturacionConductor> FacturacionConductores => Set<FacturacionConductor>();
    public DbSet<DocumentoConductor> DocumentosConductor => Set<DocumentoConductor>();

    // ── Vehiculos ─────────────────────────────────────────────
    public DbSet<Vehiculo> Vehiculos => Set<Vehiculo>();
    public DbSet<Llanta> Llantas => Set<Llanta>();
    public DbSet<VehiculoSeguro> VehiculoSeguros => Set<VehiculoSeguro>();
    public DbSet<DocumentoVehiculo> DocumentosVehiculo => Set<DocumentoVehiculo>();

    // ── Inventarios ───────────────────────────────────────────
    public DbSet<InventarioVehiculo> Inventarios => Set<InventarioVehiculo>();
    public DbSet<DocumentoInventario> DocumentosInventario => Set<DocumentoInventario>();

    // ── Contratos ─────────────────────────────────────────────
    public DbSet<Tarifa> Tarifas => Set<Tarifa>();
    public DbSet<Contrato> Contratos => Set<Contrato>();
    public DbSet<LineaContrato> LineasContrato => Set<LineaContrato>();

    // ── Facturacion ───────────────────────────────────────────
    public DbSet<PagoContrato> PagosContrato => Set<PagoContrato>();
    public DbSet<Cargo> Cargos => Set<Cargo>();
    public DbSet<PagoEmitido> PagosEmitidos => Set<PagoEmitido>();
    public DbSet<LineaPago> LineasPago => Set<LineaPago>();
    public DbSet<TarjetaConductor> TarjetasConductor => Set<TarjetaConductor>();
    public DbSet<HistoricoMovimiento> HistoricoMovimientos => Set<HistoricoMovimiento>();

    // ── Mantenimiento ─────────────────────────────────────────
    public DbSet<TipoMantenimiento> TiposMantenimiento => Set<TipoMantenimiento>();
    public DbSet<Domain.Mantenimiento.Mantenimiento> Mantenimientos => Set<Domain.Mantenimiento.Mantenimiento>();
    public DbSet<RegistroMantenimiento> RegistrosMantenimiento => Set<RegistroMantenimiento>();
    public DbSet<CargoMantenimiento> CargosMantenimiento => Set<CargoMantenimiento>();
    public DbSet<DocumentoMantenimiento> DocumentosMantenimiento => Set<DocumentoMantenimiento>();

    // ── Notificaciones ────────────────────────────────────────
    public DbSet<PlantillaNotificacion> PlantillasNotificacion => Set<PlantillaNotificacion>();
    public DbSet<Domain.Notificaciones.Notificacion> Notificaciones => Set<Domain.Notificaciones.Notificacion>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all IEntityTypeConfiguration<T> classes from this assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DecofleetDbContext).Assembly);

        // ── Global query filters ───────────────────────────────
        // Soft-delete: applied to every entity that extends BaseEntity
        ApplySoftDeleteFilter(modelBuilder);

        // Tenant isolation: applied to every tenant-scoped entity
        var tenantId = _tenant.EmpresaId;
        modelBuilder.Entity<Conductor>().HasQueryFilter(e => e.EmpresaId == tenantId && e.DeletedAt == null);
        modelBuilder.Entity<Vehiculo>().HasQueryFilter(e => e.EmpresaId == tenantId && e.DeletedAt == null);
        modelBuilder.Entity<Tarifa>().HasQueryFilter(e => e.EmpresaId == tenantId && e.DeletedAt == null);
        modelBuilder.Entity<Contrato>().HasQueryFilter(e => e.EmpresaId == tenantId && e.DeletedAt == null);
        modelBuilder.Entity<PagoContrato>().HasQueryFilter(e => e.EmpresaId == tenantId && e.DeletedAt == null);
        modelBuilder.Entity<InventarioVehiculo>().HasQueryFilter(e => e.EmpresaId == tenantId && e.DeletedAt == null);
        modelBuilder.Entity<TipoMantenimiento>().HasQueryFilter(e => e.EmpresaId == tenantId && e.DeletedAt == null);
        modelBuilder.Entity<Domain.Mantenimiento.Mantenimiento>().HasQueryFilter(e => e.EmpresaId == tenantId && e.DeletedAt == null);
        modelBuilder.Entity<PlantillaNotificacion>().HasQueryFilter(e => e.EmpresaId == tenantId && e.DeletedAt == null);
        modelBuilder.Entity<Usuario>().HasQueryFilter(e => e.EmpresaId == tenantId && e.DeletedAt == null);
        modelBuilder.Entity<Rol>().HasQueryFilter(e => e.EmpresaId == tenantId && e.DeletedAt == null);
        modelBuilder.Entity<TarjetaConductor>().HasQueryFilter(e => e.EmpresaId == tenantId && e.DeletedAt == null);
    }

    /// <summary>
    /// Applies a soft-delete filter to entity types that declare DeletedAt
    /// but are NOT covered by tenant filters above (which already include it).
    /// </summary>
    private static void ApplySoftDeleteFilter(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var deletedAtProp = entityType.FindProperty(nameof(Domain.Common.BaseEntity.DeletedAt));
            if (deletedAtProp is null) continue;

            // Skip types that already have tenant+soft-delete filter set above
            if (entityType.GetQueryFilter() is not null) continue;

            var param = Expression.Parameter(entityType.ClrType, "e");
            var prop = Expression.Property(param, nameof(Domain.Common.BaseEntity.DeletedAt));
            var body = Expression.Equal(prop, Expression.Constant(null, typeof(DateTimeOffset?)));
            modelBuilder.Entity(entityType.ClrType).HasQueryFilter(Expression.Lambda(body, param));
        }
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        SetAuditTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void SetAuditTimestamps()
    {
        var now = DateTimeOffset.UtcNow;
        foreach (var entry in ChangeTracker.Entries<Domain.Common.BaseEntity>())
        {
            if (entry.State == EntityState.Added)
                entry.Entity.CreatedAt = now;
            if (entry.State is EntityState.Added or EntityState.Modified)
                entry.Entity.UpdatedAt = now;
        }
    }
}
