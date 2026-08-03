using Decofleet.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Decofleet.Infrastructure.Services;

/// <summary>
/// Extracts the authenticated tenant's EmpresaId from the "empresa_id" JWT claim.
/// Registered as Scoped — one instance per HTTP request.
/// </summary>
public sealed class HttpTenantContext : ITenantContext
{
    public Guid EmpresaId { get; }

    public HttpTenantContext(IHttpContextAccessor httpContextAccessor)
    {
        var claim = httpContextAccessor.HttpContext?.User.FindFirst("empresa_id")?.Value;
        EmpresaId = claim is not null ? Guid.Parse(claim) : Guid.Empty;
    }
}
