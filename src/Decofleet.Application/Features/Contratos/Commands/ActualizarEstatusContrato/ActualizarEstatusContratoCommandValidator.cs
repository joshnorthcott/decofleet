using FluentValidation;

namespace Decofleet.Application.Features.Contratos.Commands.ActualizarEstatusContrato;

public sealed class ActualizarEstatusContratoCommandValidator
    : AbstractValidator<ActualizarEstatusContratoCommand>
{
    public ActualizarEstatusContratoCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.NuevoEstatus).IsInEnum().WithMessage("El estatus proporcionado no es válido.");
    }
}
