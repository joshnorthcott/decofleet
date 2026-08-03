using FluentValidation;

namespace Decofleet.Application.Features.Facturacion.Commands.RegistrarPago;

public sealed class RegistrarPagoCommandValidator : AbstractValidator<RegistrarPagoCommand>
{
    public RegistrarPagoCommandValidator()
    {
        RuleFor(x => x.PagoContratoId).NotEmpty().WithMessage("El periodo de pago es requerido.");
        RuleFor(x => x.Monto)
            .GreaterThan(0).WithMessage("El monto debe ser mayor a cero.");
        RuleFor(x => x.FechaPago).NotEmpty().WithMessage("La fecha de pago es requerida.");
        RuleFor(x => x.Referencia).MaximumLength(200);
    }
}
