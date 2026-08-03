namespace Decofleet.Application.Common.Interfaces;

/// <summary>
/// Provides the current authenticated tenant's company ID.
/// Populated from the JWT "empresa_id" claim by TenantMiddleware.
/// </summary>
public interface ITenantContext
{
    Guid EmpresaId { get; }
}
