# Working On It

Job application tracker — pnpm monorepo.

## Stack

| App/Package        | Stack                                                    |
| ------------------- | --------------------------------------------------------- |
| `backend`            | NestJS + Prisma + PostgreSQL + Better Auth (sessions)     |
| `pwa`                 | Next.js 15 + React 19, shadcn/ui, TanStack Query, Zustand |
| `landing`             | Astro + React islands                                     |
| `packages/shared`     | Zod schemas, types, TanStack Query hooks                  |
| `packages/core`       | Zustand stores (UI state)                                 |

See [CLAUDE.md](./CLAUDE.md) for architecture rules and [DESIGN.md](./DESIGN.md) for the design system.

## Getting started

```bash
pnpm install
pnpm dev          # runs backend + pwa + landing in parallel
```

Individually:

```bash
pnpm dev:backend  # http://localhost:3001
pnpm dev:pwa      # http://localhost:3000
pnpm dev:landing  # http://localhost:4321
```

## Testing

```bash
pnpm --filter backend test    # Jest
pnpm --filter pwa test        # Vitest
pnpm --filter pwa e2e         # Playwright
pnpm --filter landing test    # Vitest
pnpm typecheck                # tsc across all packages
```

## Deployment

Hosted on o2switch (cPanel Node.js Selector + Passenger). `staging` branch deploys to pre-prod, `main` deploys to production.
