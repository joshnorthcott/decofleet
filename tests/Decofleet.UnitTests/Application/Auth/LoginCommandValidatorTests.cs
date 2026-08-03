using Decofleet.Application.Features.Auth.Commands.Login;
using FluentValidation.TestHelper;

namespace Decofleet.UnitTests.Application.Auth;

public sealed class LoginCommandValidatorTests
{
    private readonly LoginCommandValidator _sut = new();

    [Fact]
    public void Valid_command_passes()
    {
        var cmd = new LoginCommand("user@example.com", "password123", Guid.NewGuid());
        _sut.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Invalid_email_fails()
    {
        var cmd = new LoginCommand("not-email", "password123", Guid.NewGuid());
        _sut.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Empty_password_fails()
    {
        var cmd = new LoginCommand("user@example.com", "", Guid.NewGuid());
        _sut.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Empty_empresa_id_fails()
    {
        var cmd = new LoginCommand("user@example.com", "password123", Guid.Empty);
        _sut.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.EmpresaId);
    }
}
