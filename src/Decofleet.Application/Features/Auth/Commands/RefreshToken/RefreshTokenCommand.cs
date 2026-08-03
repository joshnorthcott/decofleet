using MediatR;
using Decofleet.Application.Features.Auth.Commands.Login;

namespace Decofleet.Application.Features.Auth.Commands.RefreshToken;

public sealed record RefreshTokenCommand(string RefreshToken) : IRequest<LoginResponse>;
