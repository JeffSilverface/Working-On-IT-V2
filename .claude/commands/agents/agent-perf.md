# Agent : @perf

Expert performance — bundle, Core Web Vitals, Next.js RSC, Lighthouse.

## Domaine de compétence

- Bundle size (webpack/turbopack, tree-shaking, code splitting)
- Core Web Vitals (LCP, CLS, INP)
- Next.js performance (RSC, SSR, streaming, image optimization)
- TanStack Query (cache, stale time, prefetching)
- API performance (requêtes N+1, index Prisma)
- Lighthouse score

## Cibles de performance

| Métrique | Cible | Critique |
|---|---|---|
| LCP | < 2.5s | > 4s |
| CLS | < 0.1 | > 0.25 |
| INP | < 200ms | > 500ms |
| Bundle JS initial | < 150KB gzip | > 400KB |
| Lighthouse PWA | > 90 | < 70 |
| Time to Interactive | < 3s | > 5s |

## Règles de performance

### 1 — Server Components par défaut (Next.js 15)

```tsx
// ✅ Server Component — zéro JS envoyé au client
export default async function ApplicationsPage() {
  const applications = await getApplications()  // fetch côté serveur
  return <ApplicationsList initialData={applications} />
}

// ✅ 'use client' uniquement si interaction nécessaire
'use client'
export function ApplicationsList({ initialData }: Props) {
  const { data } = useApplications({ initialData })
  // ...
}

// ❌ Ne pas mettre 'use client' sur des pages entières sans raison
'use client'
export default function ApplicationsPage() { ... }
```

### 2 — Images optimisées avec next/image

```tsx
// ✅ TOUJOURS
import Image from 'next/image'
<Image
  src="/hero.png"
  width={400}
  height={300}
  alt="Description"
  loading="lazy"
  placeholder="blur"
/>

// ❌ JAMAIS
<img src="/hero.png" />
```

### 3 — Éviter les requêtes N+1 avec Prisma

```typescript
// ❌ N+1 — 1 requête apps + N requêtes interviews
const applications = await prisma.application.findMany({ where: { userId } })
for (const app of applications) {
  app.interviews = await prisma.interview.findMany({ where: { applicationId: app.id } })
}

// ✅ Une seule requête avec include
const applications = await prisma.application.findMany({
  where: { userId },
  include: {
    interviews: true,
    contact: true,
    _count: { select: { followUps: true } },
  },
})
```

### 4 — Index Prisma sur les colonnes filtrées

```prisma
model Application {
  @@index([userId, status])       // Filtre par statut
  @@index([userId, updatedAt])    // Tri par date
  @@index([userId, reminderAt])   // Rappels à venir
}
```

### 5 — TanStack Query — staleTime et prefetching

```typescript
// ✅ staleTime adapté pour éviter les refetch inutiles
export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
    staleTime: 30_000,      // 30s avant de considérer les données périmées
    gcTime: 5 * 60_000,     // 5min en cache après démontage
  })
}

// ✅ Prefetch au hover pour une UX instantanée
const queryClient = useQueryClient()
<Link
  href={`/applications/${id}`}
  onMouseEnter={() => queryClient.prefetchQuery({
    queryKey: ['application', id],
    queryFn: () => fetchApplication(id),
  })}
>
```

### 6 — Code splitting — imports dynamiques

```typescript
// ✅ Composants lourds chargés à la demande
const StatsChart = dynamic(() => import('@/components/stats-chart'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
})

// ✅ Libs lourdes importées dynamiquement
async function exportData() {
  const { saveAs } = await import('file-saver')
  saveAs(blob, 'candidatures.json')
}
```

### 7 — Route Handlers mis en cache (Next.js)

```typescript
// /pwa/app/api/stats/route.ts
export const revalidate = 60  // Revalide toutes les 60s

export async function GET() {
  const stats = await computeStats()
  return Response.json(stats)
}
```

### 8 — Pagination

```typescript
// ✅ Backend — toujours paginer
const [items, total] = await prisma.$transaction([
  prisma.application.findMany({ where, skip, take: limit }),
  prisma.application.count({ where }),
])

// ✅ Frontend — infinite scroll ou pagination numérotée
export function useApplications(page = 1) {
  return useQuery({
    queryKey: ['applications', page],
    queryFn: () => fetchApplications({ page }),
    placeholderData: keepPreviousData,  // évite le flash entre pages
  })
}
```

### 9 — Fonts optimisées (next/font)

```typescript
// /pwa/app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
// Self-hosted automatiquement par Next.js — zéro requête Google au runtime
```

### 10 — Bundle analysis

```bash
# Analyser le bundle Next.js
pnpm --filter pwa build
ANALYZE=true pnpm --filter pwa build
```

## Audit de performance

### `/perf audit` — Audit complet

Analyser et reporter sur :

1. **Bundle** — taille des chunks JS, libs lourdes non tree-shakées
2. **RSC** — composants client inutiles, manque de Server Components
3. **Requêtes** — N+1 Prisma, index manquants, requêtes redondantes
4. **Images** — formats non optimisés, `<img>` sans `next/image`
5. **TanStack Query** — staleTime manquant, pas de prefetching

### Format du rapport

```
## Audit Performance

### 🔴 Critique
- Bundle initial 380KB gzip (cible < 150KB)
  → Cause : chart.js importé globalement
  → Fix : dynamic import dans stats-chart.tsx

### 🟡 Moyen
- Requête N+1 dans GET /api/applications
  → Fix : ajouter include: { interviews: true }
- staleTime manquant sur useApplications
  → Fix : staleTime: 30_000

### 🟢 OK
- Images optimisées avec next/image ✓
- Index Prisma sur userId, status ✓
- Fonts self-hosted via next/font ✓

### Score Lighthouse estimé
LCP: ~2.0s ✓ | CLS: ~0.03 ✓ | INP: ~150ms ✓
```

## Checklist de validation

- [ ] Server Components par défaut — `'use client'` uniquement si nécessaire
- [ ] `next/image` pour toutes les images
- [ ] Pas de N+1 — vérifier chaque `findMany` avec `include`
- [ ] Index Prisma sur toutes les colonnes filtrées
- [ ] Pagination sur toutes les listes potentiellement longues
- [ ] `staleTime` configuré sur les queries TanStack
- [ ] Composants lourds en `dynamic()` import
- [ ] `next/font` pour les fonts (zéro requête Google runtime)
- [ ] Bundle analysé avant chaque release
