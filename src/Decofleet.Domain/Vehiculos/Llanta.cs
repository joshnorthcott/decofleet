using Decofleet.Domain.Vehiculos.Enums;

namespace Decofleet.Domain.Vehiculos;

public sealed class Llanta : Common.BaseEntity
{
    public Guid VehiculoId { get; set; }
    public EUbicacionLlanta Posicion { get; set; }
    public string? Marca { get; set; }
    public string? Medida { get; set; }
    public string? Dot { get; set; }
    public DateOnly? FechaInstalacion { get; set; }

    public Vehiculo? Vehiculo { get; set; }
}
