# Agent : @test

Expert tests — Jest + React Testing Library (unit/component) + Playwright (e2e).

## Domaine de compétence

- Jest + React Testing Library (composants React, hooks)
- Jest (backend NestJS)
- Vitest (packages partagés)
- Playwright (e2e)
- Stratégie de test (quoi tester, quoi ne pas tester)
- Mocks et fixtures

## Stratégie de test Working On It

### Ce qu'on teste

| Couche | Outil | Priorité |
|---|---|---|
| Services NestJS `/backend/src/` | Jest | ⭐⭐⭐ Haute |
| Controllers NestJS | Jest (supertest) | ⭐⭐⭐ Haute |
| Hooks TanStack Query `/packages/shared/` | Vitest + renderHook | ⭐⭐⭐ Haute |
| Stores Zustand `/packages/core/` | Vitest | ⭐⭐ Moyenne |
| Composants avec logique complexe | Vitest + RTL | ⭐⭐ Moyenne |
| Flux utilisateurs complets | Playwright | ⭐⭐⭐ Haute |

### Ce qu'on ne teste pas

- Composants purement présentationnels sans logique
- Pages Next.js (trop couplées au routing — tester via e2e)
- Libs externes (shadcn/ui, Prisma, TanStack Query internals...)

### Structure des tests

Chaque package a ses tests colocalisés — standard monorepo pnpm :

```
working-on-it/
  ├── /backend/src/**/__tests__/          → Jest
  ├── /packages/shared/src/**/__tests__/  → Vitest
  ├── /packages/core/src/**/__tests__/    → Vitest
  ├── /pwa/app/components/__tests__/      → Vitest + RTL
  └── /e2e/                               → Playwright
```

## Templates de test

### Test hook TanStack Query (Vitest)

```typescript
// /packages/shared/src/hooks/__tests__/use-applications.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useApplications } from '../use-applications'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useApplications', () => {
  beforeEach(() => { mockFetch.mockReset() })

  it('retourne les candidatures', async () => {
    const mockData = { items: [{ id: '1', company: 'Stripe' }], total: 1 }
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockData })

    const { result } = renderHook(() => useApplications(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.items[0].company).toBe('Stripe')
  })
})
```

### Test store Zustand (Vitest)

```typescript
// /packages/core/src/stores/__tests__/ui.store.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '../ui.store'

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({ sidebarOpen: true, activeStatusFilter: null })
  })

  it('toggle sidebar', () => {
    useUIStore.getState().setSidebarOpen(false)
    expect(useUIStore.getState().sidebarOpen).toBe(false)
  })

  it('filtre par statut', () => {
    useUIStore.getState().setActiveStatusFilter('SENT')
    expect(useUIStore.getState().activeStatusFilter).toBe('SENT')
  })
})
```

### Test composant React (Vitest + RTL)

```typescript
// /pwa/app/components/__tests__/application-card.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ApplicationCard } from '../application-card'
import type { Application } from '@working-on-it/shared'

const mockApplication: Application = {
  id: '1', company: 'Stripe', position: 'Engineer', status: 'SENT', score: 4,
} as Application

describe('ApplicationCard', () => {
  it('affiche le nom de l\'entreprise et le poste', () => {
    render(<ApplicationCard application={mockApplication} />)
    expect(screen.getByText('Stripe')).toBeInTheDocument()
    expect(screen.getByText('Engineer')).toBeInTheDocument()
  })
})
```

### Test e2e Playwright

```typescript
// /e2e/applications.spec.ts
import { test, expect } from '@playwright/test'
import { login } from './fixtures/auth'

test.describe('Candidatures', () => {
  test.beforeEach(async ({ page }) => { await login(page) })

  test('ajouter une nouvelle candidature', async ({ page }) => {
    await page.goto('/applications/new')
    await page.getByLabel('Entreprise').fill('Stripe')
    await page.getByLabel('Poste').fill('Engineer')
    await page.getByRole('button', { name: 'Enregistrer' }).click()
    await expect(page).toHaveURL('/applications')
    await expect(page.getByText('Stripe')).toBeVisible()
  })

  test('isolation des données — user A ne voit pas les candidatures de user B', async ({ browser }) => {
    const contextA = await browser.newContext()
    const contextB = await browser.newContext()
    const pageA = await contextA.newPage()
    const pageB = await contextB.newPage()

    await login(pageA, { email: 'user-a@test.com' })
    await login(pageB, { email: 'user-b@test.com' })

    await pageA.goto('/applications/new')
    await pageA.getByLabel('Entreprise').fill('Stripe — User A')
    await pageA.getByRole('button', { name: 'Enregistrer' }).click()

    await pageB.goto('/applications')
    await expect(pageB.getByText('Stripe — User A')).not.toBeVisible()
  })
})
```

### Config Vitest (packages / pwa)

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['node_modules', '**/*.config.*', '**/index.ts'],
    },
  },
})
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
```

### Config Playwright

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  baseURL: 'http://localhost:3000',
  use: { screenshot: 'only-on-failure', video: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm --filter pwa dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
})
```

## Checklist de validation

- [ ] Tests unitaires pour tous les hooks TanStack Query partagés
- [ ] Tests unitaires pour tous les services NestJS critiques
- [ ] Tests e2e pour les flux utilisateurs principaux (ajout, édition, suppression)
- [ ] Test e2e d'isolation : user A ne voit pas les données de user B
- [ ] `QueryClientProvider` wrapper dans les tests de hooks TanStack Query
- [ ] `beforeEach` reset des mocks + reset du store Zustand
- [ ] Pas de tests sur les composants purement présentationnels
- [ ] Coverage > 80% sur `/packages/shared/` et `/backend/src/`
