using Decofleet.Domain.Conductores;
using Decofleet.Domain.Contratos;
using Decofleet.Domain.Facturacion;
using Decofleet.Domain.Inventarios;
using Decofleet.Domain.Mantenimiento;
using Decofleet.Domain.Notificaciones;
using Decofleet.Domain.Seguridad;
using Decofleet.Domain.Vehiculos;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Application.Common.Interfaces;

/// <summary>
/// Abstraction over the EF Core DbContext. Application handlers depend on this
/// interface, not on the concrete DbContext, keeping the Application layer
/// free from Infrastructure dependencies.
/// </summary>
public interface IDecofleetDbContext
{
    // Seguridad
    DbSet<Empresa> Empresas { get; }
    DbSet<Usuario> Usuarios { get; }
    DbSet<Rol> Roles { get; }
    DbSet<Permiso> Permisos { get; }
    DbSet<RolPermiso> RolPermisos { get; }
    DbSet<RefreshToken> RefreshTokens { get; }

    // Conductores
    DbSet<Conductor> Conductores { get; }
    DbSet<Licencia> Licencias { get; }
    DbSet<ReferenciaConductor> ReferenciasConductor { get; }
    DbSet<ConfiguracionPago> ConfiguracionesPago { get; }
    DbSet<FacturacionConductor> FacturacionConductores { get; }
    DbSet<DocumentoConductor> DocumentosConductor { get; }

    // Vehiculos
    DbSet<Vehiculo> Vehiculos { get; }
    DbSet<Llanta> Llantas { get; }
    DbSet<VehiculoSeguro> VehiculoSeguros { get; }
    DbSet<DocumentoVehiculo> DocumentosVehiculo { get; }

    // Inventarios
    DbSet<InventarioVehiculo> Inventarios { get; }
    DbSet<DocumentoInventario> DocumentosInventario { get; }

    // Contratos
    DbSet<Tarifa> Tarifas { get; }
    DbSet<Contrato> Contratos { get; }
    DbSet<LineaContrato> LineasContrato { get; }

    // Facturacion
    DbSet<PagoContrato> PagosContrato { get; }
    DbSet<Cargo> Cargos { get; }
    DbSet<PagoEmitido> PagosEmitidos { get; }
    DbSet<LineaPago> LineasPago { get; }
    DbSet<TarjetaConductor> TarjetasConductor { get; }
    DbSet<HistoricoMovimiento> HistoricoMovimientos { get; }

    // Mantenimiento
    DbSet<TipoMantenimiento> TiposMantenimiento { get; }
    DbSet<Domain.Mantenimiento.Mantenimiento> Mantenimientos { get; }
    DbSet<RegistroMantenimiento> RegistrosMantenimiento { get; }
    DbSet<CargoMantenimiento> CargosMantenimiento { get; }
    DbSet<DocumentoMantenimiento> DocumentosMantenimiento { get; }

    // Notificaciones
    DbSet<PlantillaNotificacion> PlantillasNotificacion { get; }
    DbSet<Domain.Notificaciones.Notificacion> Notificaciones { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
