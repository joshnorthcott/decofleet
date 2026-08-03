using Decofleet.Application.Common.Exceptions;
using Decofleet.Application.Common.Interfaces;
using Decofleet.Application.Features.Facturacion.Dtos;
using Decofleet.Domain.Facturacion;
using Decofleet.Domain.Facturacion.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Decofleet.Application.Features.Facturacion.Commands.RegistrarPago;

public sealed class RegistrarPagoCommandHandler : IRequestHandler<RegistrarPagoCommand, PagoEmitidoDto>
{
    private readonly IDecofleetDbContext _db;
    private readonly ITenantContext _tenant;
    private readonly ICurrentUserService _currentUser;

    public RegistrarPagoCommandHandler(
        IDecofleetDbContext db, ITenantContext tenant, ICurrentUserService currentUser)
    {
        _db = db;
        _tenant = tenant;
        _currentUser = currentUser;
    }

    public async Task<PagoEmitidoDto> Handle(RegistrarPagoCommand request, CancellationToken cancellationToken)
    {
        var pagoContrato = await _db.PagosContrato
            .Include(p => p.Cargos)
            .Include(p => p.PagosEmitidos)
            .FirstOrDefaultAsync(p => p.Id == request.PagoContratoId, cancellationToken)
            ?? throw new NotFoundException(nameof(PagoContrato), request.PagoContratoId);

        if (pagoContrato.Estatus == EEstatusPago.Cancelado)
            throw new ValidationException([new FluentValidation.Results.ValidationFailure(
                "PagoContratoId", "No se puede registrar un pago en un periodo cancelado.")]);

        var montoPreviamentePagado = pagoContrato.PagosEmitidos.Sum(e => e.Monto);
        var saldoPendiente = pagoContrato.MontoTotal - montoPreviamentePagado;

        if (request.Monto > saldoPendiente)
            throw new ValidationException([new FluentValidation.Results.ValidationFailure(
                "Monto", $"El monto ({request.Monto:C}) excede el saldo pendiente ({saldoPendiente:C}).")]);

        var pagoEmitido = new PagoEmitido
        {
            PagoContratoId = request.PagoContratoId,
            EmpresaId = _tenant.EmpresaId,
            Monto = request.Monto,
            FormaPago = request.FormaPago,
            FechaPago = request.FechaPago,
            Referencia = request.Referencia,
            CreatedById = _currentUser.UserId,
        };

        _db.PagosEmitidos.Add(pagoEmitido);

        // Append-only audit log
        _db.HistoricoMovimientos.Add(new HistoricoMovimiento
        {
            EmpresaId = _tenant.EmpresaId,
            EntidadTipo = nameof(PagoEmitido),
            EntidadId = pagoEmitido.Id,
            Descripcion = $"Pago registrado — {request.FormaPago}",
            Monto = request.Monto,
            Fecha = request.FechaPago,
        });

        // Update status
        var totalPagado = montoPreviamentePagado + request.Monto;
        pagoContrato.Estatus = totalPagado >= pagoContrato.MontoTotal
            ? EEstatusPago.Pagado
            : EEstatusPago.PagadoParcial;

        await _db.SaveChangesAsync(cancellationToken);

        return new PagoEmitidoDto(
            pagoEmitido.Id,
            pagoEmitido.PagoContratoId,
            pagoEmitido.Monto,
            pagoEmitido.FormaPago.ToString(),
            pagoEmitido.FechaPago,
            pagoEmitido.Referencia);
    }
}
