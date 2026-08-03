using Decofleet.Domain.Conductores;
using Decofleet.Domain.Conductores.Enums;

namespace Decofleet.UnitTests.Domain;

public sealed class ConductorTests
{
    [Fact]
    public void NewConductor_ShouldHaveActivoStatus()
    {
        var conductor = new Conductor
        {
            EmpresaId = Guid.NewGuid(),
            Nombre = "Juan",
            ApellidoPaterno = "Garcia"
        };

        Assert.Equal(EEstatusConductor.Activo, conductor.Estatus);
    }

    [Fact]
    public void NewConductor_ShouldHaveNonEmptyId()
    {
        var conductor = new Conductor();
        Assert.NotEqual(Guid.Empty, conductor.Id);
    }
}
