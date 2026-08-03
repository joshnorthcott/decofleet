# Decofleet v2

Modern fleet management platform rebuilt from the ground up.

## Stack
- **Backend**: .NET 9, ASP.NET Core Minimal APIs, Entity Framework Core 9
- **Database**: PostgreSQL 16 (via Npgsql + EFCore.NamingConventions)
- **Frontend**: Next.js 15 (coming Phase 5)

## Solution Layout
```
src/
  Decofleet.Domain/          # Entities, enums, value objects — zero framework deps
  Decofleet.Application/     # Use cases (CQRS), interfaces, DTOs
  Decofleet.Infrastructure/  # EF Core, PostgreSQL, AWS S3, email, SMS
  Decofleet.Api/             # Carter route modules, JWT auth, middleware
  Decofleet.Contracts/       # Shared request/response types
tests/
  Decofleet.UnitTests/       # Domain + Application layer (no I/O)
  Decofleet.IntegrationTests/# Real Postgres via Testcontainers
```

## Local Development

### Prerequisites
- .NET 9 SDK
- Docker (for local PostgreSQL)

### Run PostgreSQL locally
```bash
docker run -d --name decofleet-pg \
  -e POSTGRES_DB=decofleet_db \
  -e POSTGRES_PASSWORD=changeme \
  -p 5432:5432 postgres:16
```

### Apply migrations
```bash
cd src/Decofleet.Api
dotnet ef migrations add InitialCreate --project ../Decofleet.Infrastructure
dotnet ef database update --project ../Decofleet.Infrastructure
```

### Run the API
```bash
cd src/Decofleet.Api
dotnet run
# Health check: http://localhost:5000/health
```

## Build Phases
- [x] **Phase 1**: Domain layer — all entities and enums
- [x] **Phase 2**: Infrastructure scaffold — DbContext, EF configurations, DI
- [ ] **Phase 3**: Application layer — MediatR CQRS handlers, FluentValidation
- [ ] **Phase 4**: API layer — auth endpoints, conductor + vehiculo modules
- [ ] **Phase 5**: Next.js frontend scaffold
