#!/usr/bin/env bash
# Run EF Core migrations against the database.
# Usage: ./scripts/migrate.sh [migration-name]
#
# Prerequisites:
#   dotnet tool install --global dotnet-ef
#   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;..."
#     (in src/Decofleet.Api/)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$SCRIPT_DIR/.."

INFRA_PROJECT="$ROOT/src/Decofleet.Infrastructure"
API_PROJECT="$ROOT/src/Decofleet.Api"

if [[ "${1:-}" == "add" ]]; then
  MIGRATION_NAME="${2:-$(date +%Y%m%d_%H%M%S)_Migration}"
  echo "Creating migration: $MIGRATION_NAME"
  dotnet ef migrations add "$MIGRATION_NAME" \
    --project "$INFRA_PROJECT" \
    --startup-project "$API_PROJECT"
else
  echo "Applying migrations..."
  dotnet ef database update \
    --project "$INFRA_PROJECT" \
    --startup-project "$API_PROJECT"
  echo "Migrations applied."
fi
