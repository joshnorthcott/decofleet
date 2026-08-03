using Decofleet.Application.Features.Contratos.Dtos;
using Decofleet.Domain.Contratos.Enums;
using MediatR;

namespace Decofleet.Application.Features.Contratos.Commands.CreateContrato;

public sealed record CreateContratoCommand(
    Guid ConductorId,
    Guid VehiculoId,
    Guid TarifaId,
    DateOnly FechaInicio,
    DateOnly? FechaFin,
    EFormaPago FormaPago,
    string? Observaciones
) : IRequest<ContratoDto>;
