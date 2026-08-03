using FluentValidation;

namespace Decofleet.Application.Features.Contratos.Commands.CreateContrato;

public sealed class CreateContratoCommandValidator : AbstractValidator<CreateContratoCommand>
{
    public CreateContratoCommandValidator()
    {
        RuleFor(x => x.ConductorId).NotEmpty().WithMessage("El conductor es requerido.");
        RuleFor(x => x.VehiculoId).NotEmpty().WithMessage("El vehículo es requerido.");
        RuleFor(x => x.TarifaId).NotEmpty().WithMessage("La tarifa es requerida.");
        RuleFor(x => x.FechaInicio).NotEmpty().WithMessage("La fecha de inicio es requerida.");
        RuleFor(x => x.FechaFin)
            .GreaterThan(x => x.FechaInicio)
            .When(x => x.FechaFin.HasValue)
            .WithMessage("La fecha de fin debe ser posterior a la fecha de inicio.");
        RuleFor(x => x.Observaciones).MaximumLength(2000);
    }
}
