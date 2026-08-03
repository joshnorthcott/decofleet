using Decofleet.Domain.Vehiculos.Enums;

namespace Decofleet.Domain.Vehiculos;

public sealed class Vehiculo : Common.AuditableEntity
{
    public Guid EmpresaId { get; set; }
    public string Marca { get; set; } = string.Empty;
    public string Modelo { get; set; } = string.Empty;
    public int Anio { get; set; }
    public string? Placas { get; set; }
    public string? Vin { get; set; }
    public string? Color { get; set; }
    public EEstatusVehiculo Estatus { get; set; } = EEstatusVehiculo.Disponible;
    public string? Telefono { get; set; }

    public Seguridad.Empresa? Empresa { get; set; }
    public ICollection<Llanta> Llantas { get; set; } = new List<Llanta>();
    public ICollection<VehiculoSeguro> Seguros { get; set; } = new List<VehiculoSeguro>();
    public ICollection<DocumentoVehiculo> Documentos { get; set; } = new List<DocumentoVehiculo>();
}
