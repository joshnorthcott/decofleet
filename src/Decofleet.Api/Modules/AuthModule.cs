using Carter;
using Decofleet.Application.Features.Auth.Commands.Login;
using Decofleet.Application.Features.Auth.Commands.RefreshToken;
using Decofleet.Contracts.Auth;
using MediatR;

namespace Decofleet.Api.Modules;

/// <summary>
/// Authentication endpoints.
/// Rate-limited to 5 requests/minute to mitigate brute force.
/// No [Authorize] attribute — these are the entry points for obtaining tokens.
/// </summary>
public sealed class AuthModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth")
            .WithTags("Auth")
            .RequireRateLimiting("auth");

        group.MapPost("/login", Login)
            .AllowAnonymous()
            .WithSummary("Authenticate with email + password and receive JWT tokens.")
            .Produces<LoginResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status422UnprocessableEntity);

        group.MapPost("/refresh", Refresh)
            .AllowAnonymous()
            .WithSummary("Exchange a valid refresh token for a new token pair.")
            .Produces<LoginResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status422UnprocessableEntity);
    }

    private static async Task<IResult> Login(
        LoginRequest request, ISender sender, CancellationToken ct)
    {
        var result = await sender.Send(
            new LoginCommand(request.Email, request.Password, request.EmpresaId), ct);
        return Results.Ok(result);
    }

    private static async Task<IResult> Refresh(
        RefreshTokenRequest request, ISender sender, CancellationToken ct)
    {
        var result = await sender.Send(new RefreshTokenCommand(request.RefreshToken), ct);
        return Results.Ok(result);
    }
}
