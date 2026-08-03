# Decofleet Frontend

Next.js 15 + React 19 + TypeScript + Tailwind CSS 4

## Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4
- **Auth**: Auth.js v5 (NextAuth) — credentials provider → .NET backend
- **Data fetching**: TanStack Query v5
- **Tables**: TanStack Table v8
- **Forms**: React Hook Form + Zod
- **State**: Zustand v5
- **Icons**: Lucide React

## Getting started

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env.local
# Edit .env.local with your API_URL and AUTH_SECRET

# Start dev server (requires backend running)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

### Auth flow
1. User submits email + password + empresaId on `/login`
2. Auth.js Credentials provider calls `POST /api/auth/login` on the .NET backend
3. Access token + refresh token stored in encrypted server-side JWT session cookie
4. Browser requests go through `/backend/...` → Next.js proxy route → .NET backend
5. Proxy injects `Authorization: Bearer <token>` server-side (token never touches browser JS)
6. Auth.js silently refreshes the access token in the JWT callback when it expires

### Proxy route
`src/app/api/proxy/[...path]/route.ts` forwards all requests with the current session token.
Browser components call `/backend/api/...` and never see the raw JWT.

## Phase roadmap
- [x] Phase 5: Scaffold, auth, core layout, Conductores CRUD, stub views
- [ ] Phase 6: Full forms for Vehículos, Contratos, Pagos; Dashboard charts (Recharts)
- [ ] Phase 7: Mantenimiento, Notificaciones modules
