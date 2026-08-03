using Decofleet.Domain.Contratos.Enums;
using MediatR;

namespace Decofleet.Application.Features.Contratos.Commands.ActualizarEstatusContrato;

public sealed record ActualizarEstatusContratoCommand(
    Guid Id,
    EEstatusContrato NuevoEstatus
) : IRequest;
