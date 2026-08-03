# ── Stage 1: Build ─────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files first so layer cache is reused unless deps change
COPY Decofleet.sln .
COPY src/Decofleet.Domain/Decofleet.Domain.csproj             src/Decofleet.Domain/
COPY src/Decofleet.Application/Decofleet.Application.csproj   src/Decofleet.Application/
COPY src/Decofleet.Infrastructure/Decofleet.Infrastructure.csproj src/Decofleet.Infrastructure/
COPY src/Decofleet.Contracts/Decofleet.Contracts.csproj        src/Decofleet.Contracts/
COPY src/Decofleet.Api/Decofleet.Api.csproj                    src/Decofleet.Api/
COPY tests/Decofleet.Tests.Integration/Decofleet.Tests.Integration.csproj tests/Decofleet.Tests.Integration/

RUN dotnet restore

COPY . .

RUN dotnet publish src/Decofleet.Api/Decofleet.Api.csproj \
    -c Release -o /app/publish \
    --no-restore \
    /p:TreatWarningsAsErrors=false

# ── Stage 2: Runtime ───────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Non-root user for security
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "Decofleet.Api.dll"]
