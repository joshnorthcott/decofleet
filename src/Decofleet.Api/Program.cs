using Decofleet.Infrastructure.Aws;
using System.Threading.RateLimiting;
using Carter;
using Decofleet.Application;
using Decofleet.Application.Common.Exceptions;
using Decofleet.Infrastructure;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.OpenApi.Models;
using Serilog;

// ── Bootstrap Serilog before anything else ────────────────────
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // ── AWS Secrets Manager (non-Development only) ─────────────
    var secretId = Environment.GetEnvironmentVariable("AWS_SECRETS_MANAGER_SECRET_ID");
    var awsRegion = Environment.GetEnvironmentVariable("AWS_REGION") ?? "us-east-1";
    if (!string.IsNullOrEmpty(secretId) && !builder.Environment.IsDevelopment())
    {
        builder.Configuration.AddAwsSecretsManager(secretId, awsRegion);
    }

    builder.Host.UseSerilog((ctx, services, cfg) =>
        cfg.ReadFrom.Configuration(ctx.Configuration)
           .ReadFrom.Services(services)
           .Enrich.FromLogContext()
           .WriteTo.Console());

    // ── Application + Infrastructure ──────────────────────────
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);

    // ── Carter (Minimal API modules) ──────────────────────────
    builder.Services.AddCarter();

    // ── CORS — explicit origins, never wildcard ───────────────
    var allowedOrigins = builder.Configuration
        .GetSection("AllowedOrigins").Get<string[]>() ?? [];

    builder.Services.AddCors(opts =>
        opts.AddPolicy("DecofleetPolicy", policy =>
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials()));

    // ── Rate limiting (auth endpoints: 5 req / 1 min) ─────────
    builder.Services.AddRateLimiter(opts =>
    {
        opts.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

        opts.AddPolicy("auth", ctx =>
            RateLimitPartition.GetSlidingWindowLimiter(
                partitionKey: ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                factory: _ => new SlidingWindowRateLimiterOptions
                {
                    PermitLimit = 5,
                    Window = TimeSpan.FromMinutes(1),
                    SegmentsPerWindow = 3,
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                    QueueLimit = 0,
                }));
    });

    // ── Swagger (Development only) ────────────────────────────
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v2", new OpenApiInfo
        {
            Title = "Decofleet API",
            Version = "v2",
            Description = "Fleet management platform REST API"
        });
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            Description = "Enter your JWT access token."
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            [new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            }] = []
        });
    });

    var app = builder.Build();

    // ── Middleware pipeline ───────────────────────────────────
    app.UseSerilogRequestLogging();

    // Global exception → consistent JSON error body
    app.UseExceptionHandler(errApp =>
    {
        errApp.Run(async ctx =>
        {
            var feature = ctx.Features.Get<IExceptionHandlerFeature>();
            var ex = feature?.Error;

            (int status, object body) = ex switch
            {
                ValidationException ve => (422, new { errors = ve.Errors }),
                NotFoundException nfe  => (404, new { error = nfe.Message }),
                ForbiddenException fe  => (403, new { error = fe.Message }),
                _                      => (500, new { error = "An unexpected error occurred." }),
            };

            ctx.Response.StatusCode = status;
            ctx.Response.ContentType = "application/json";
            await ctx.Response.WriteAsJsonAsync(body);
        });
    });

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v2/swagger.json", "Decofleet API v2");
            c.RoutePrefix = "swagger";
        });
    }

    app.UseCors("DecofleetPolicy");
    app.UseRateLimiter();
    app.UseAuthentication();
    app.UseAuthorization();

    app.MapCarter();

    app.MapGet("/health", () => Results.Ok(new
    {
        status = "healthy",
        version = "2.0",
        timestamp = DateTimeOffset.UtcNow
    })).AllowAnonymous();

    // ── Seed mode: dotnet run -- --seed ──────────────────────
    if (args.Contains("--seed"))
    {
        using var scope  = app.Services.CreateScope();
        var seeder = scope.ServiceProvider
            .GetRequiredService<Decofleet.Infrastructure.Persistence.DbSeeder>();
        await seeder.SeedAsync();
        Log.Information("Seed completed — exiting.");
        return;
    }

    app.Run();
}
catch (Exception ex) when (ex is not HostAbortedException)
{
    Log.Fatal(ex, "Application terminated unexpectedly.");
}
finally
{
    Log.CloseAndFlush();
}

// Expose for integration tests
public partial class Program { }
