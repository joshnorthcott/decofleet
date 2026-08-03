#!/usr/bin/env bash
# Seed the database with initial data (Empresa, Roles, Tarifas, admin user).
# Set SEED_ADMIN_PASSWORD env var to control the admin password.
# If not set, a random password is generated and printed to the console.
#
# Usage: ./scripts/seed.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$SCRIPT_DIR/.."

echo "Running database seeder..."
dotnet run \
  --project "$ROOT/src/Decofleet.Api" \
  --no-build \
  -- --seed

echo "Seeding complete."
