using FluentValidation;

namespace Decofleet.Application.Features.Conductores.Commands.UpdateConductor;

public sealed class UpdateConductorCommandValidator : AbstractValidator<UpdateConductorCommand>
{
    public UpdateConductorCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Nombre).NotEmpty().MaximumLength(100);
        RuleFor(x => x.ApellidoPaterno).NotEmpty().MaximumLength(100);
        RuleFor(x => x.ApellidoMaterno).MaximumLength(100);
        RuleFor(x => x.Curp)
            .MaximumLength(18)
            .Matches(@"^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$")
            .When(x => !string.IsNullOrWhiteSpace(x.Curp))
            .WithMessage("La CURP no tiene un formato válido.");
        RuleFor(x => x.Telefono).MaximumLength(20);
        RuleFor(x => x.Email)
            .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.Email))
            .WithMessage("El correo no tiene un formato válido.")
            .MaximumLength(200);
        RuleFor(x => x.CodigoPostal)
            .MaximumLength(10)
            .Matches(@"^[0-9]{5}$")
            .When(x => !string.IsNullOrWhiteSpace(x.CodigoPostal))
            .WithMessage("El código postal debe tener 5 dígitos.");
    }
}
