using Decofleet.Application.Features.Conductores.Commands.CreateConductor;
using FluentValidation.TestHelper;

namespace Decofleet.UnitTests.Application.Conductores;

public sealed class CreateConductorCommandValidatorTests
{
    private readonly CreateConductorCommandValidator _sut = new();

    [Fact]
    public void Valid_command_should_have_no_errors()
    {
        var cmd = new CreateConductorCommand("Juan", "Garcia", null, null, "5551234567", null, null, null);
        var result = _sut.TestValidate(cmd);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Empty_nombre_should_fail(string nombre)
    {
        var cmd = new CreateConductorCommand(nombre, "Garcia", null, null, null, null, null, null);
        var result = _sut.TestValidate(cmd);
        result.ShouldHaveValidationErrorFor(x => x.Nombre);
    }

    [Fact]
    public void Invalid_email_should_fail()
    {
        var cmd = new CreateConductorCommand("Juan", "Garcia", null, null, null, "not-an-email", null, null);
        var result = _sut.TestValidate(cmd);
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Invalid_curp_should_fail()
    {
        var cmd = new CreateConductorCommand("Juan", "Garcia", null, "BADCURP", null, null, null, null);
        var result = _sut.TestValidate(cmd);
        result.ShouldHaveValidationErrorFor(x => x.Curp);
    }
}
