using FluentValidation;

namespace Decofleet.Application.Features.Vehiculos.Commands.CreateVehiculo;

public sealed class CreateVehiculoCommandValidator : AbstractValidator<CreateVehiculoCommand>
{
    public CreateVehiculoCommandValidator()
    {
        RuleFor(x => x.Marca).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Modelo).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Anio)
            .InclusiveBetween(1980, DateTime.UtcNow.Year + 1)
            .WithMessage($"El año debe estar entre 1980 y {DateTime.UtcNow.Year + 1}.");
        RuleFor(x => x.Placas).MaximumLength(20);
        RuleFor(x => x.Vin)
            .MaximumLength(17)
            .Matches(@"^[A-HJ-NPR-Z0-9]{17}$")
            .When(x => !string.IsNullOrWhiteSpace(x.Vin))
            .WithMessage("El VIN debe tener 17 caracteres alfanuméricos válidos.");
        RuleFor(x => x.Color).MaximumLength(50);
        RuleFor(x => x.Telefono).MaximumLength(20);
    }
}
