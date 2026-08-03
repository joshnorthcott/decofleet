# ── Decofleet v2 — Developer Makefile ─────────────────────────────────────────
# Usage: make <target>

.PHONY: help up down api frontend migrate migrate-add seed \
        build test clean user-secrets-setup

help: ## Show this help
	@awk 'BEGIN{FS=":.*##"} /^[a-zA-Z_-]+:.*?##/{printf "  \033[36m%-20s\033[0m %s\n",$$1,$$2}' $(MAKEFILE_LIST)

# ── Infrastructure ─────────────────────────────────────────────────────────────
up: ## Start PostgreSQL (and API if built)
	docker compose up -d postgres

down: ## Stop all containers
	docker compose down

up-all: ## Start PostgreSQL + API containers
	docker compose up -d

# ── Backend ────────────────────────────────────────────────────────────────────
api: ## Run the .NET API locally (hot reload)
	dotnet watch run --project src/Decofleet.Api

build: ## Build the entire solution
	dotnet build Decofleet.sln

test: ## Run integration tests
	dotnet test tests/Decofleet.Tests.Integration

# ── Database ───────────────────────────────────────────────────────────────────
migrate: ## Apply pending EF Core migrations
	./scripts/migrate.sh

migrate-add: ## Create a new migration (NAME=YourMigrationName)
	./scripts/migrate.sh add $(NAME)

seed: ## Seed the database with initial data
	./scripts/seed.sh

# ── Frontend ───────────────────────────────────────────────────────────────────
frontend: ## Run the Next.js frontend (dev mode)
	cd frontend && npm run dev

frontend-install: ## Install frontend dependencies
	cd frontend && npm install

# ── Local setup helpers ────────────────────────────────────────────────────────
user-secrets-setup: ## Interactively set local dev secrets via dotnet user-secrets
	@echo "Setting up dotnet user-secrets for local development..."
	@cd src/Decofleet.Api && dotnet user-secrets init 2>/dev/null || true
	@read -p "DB connection string: " CONN; \
	  cd src/Decofleet.Api && dotnet user-secrets set "ConnectionStrings:DefaultConnection" "$$CONN"
	@read -p "JWT secret key (min 32 chars): " JWT; \
	  cd src/Decofleet.Api && dotnet user-secrets set "Jwt:SecretKey" "$$JWT"
	@echo "User secrets saved. Run 'make api' to start the backend."

clean: ## Remove build artifacts
	find . -name "bin" -o -name "obj" | xargs rm -rf
	rm -rf frontend/.next frontend/node_modules
