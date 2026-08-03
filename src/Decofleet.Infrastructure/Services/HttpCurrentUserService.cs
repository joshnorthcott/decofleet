using Decofleet.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Decofleet.Infrastructure.Services;

public sealed class HttpCurrentUserService : ICurrentUserService
{
    public Guid? UserId { get; }

    public HttpCurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        var sub = httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
               ?? httpContextAccessor.HttpContext?.User.FindFirst("sub")?.Value;
        UserId = sub is not null ? Guid.Parse(sub) : null;
    }
}
