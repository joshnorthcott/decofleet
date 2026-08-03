using Decofleet.Domain.Vehiculos.Enums;

namespace Decofleet.Domain.Vehiculos;

public sealed class VehiculoSeguro : Common.BaseEntity
{
    public Guid VehiculoId { get; set; }
    public string Aseguradora { get; set; } = string.Empty;
    public string NumPoliza { get; set; } = string.Empty;
    public ETipoPoliza TipoPoliza { get; set; }
    public DateOnly VigenciaInicio { get; set; }
    public DateOnly VigenciaFin { get; set; }
    public decimal? Monto { get; set; }
    public string? Comentarios { get; set; }

    public Vehiculo? Vehiculo { get; set; }
}
