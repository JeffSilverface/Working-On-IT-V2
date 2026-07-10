# /new-page

Crée une nouvelle page Next.js 15 (App Router) pour Working On It.

## Protocole obligatoire

### Étape 1 — Lire les fichiers de contexte
Lire `CLAUDE.md` et `DESIGN.md` avant toute génération.

### Étape 2 — Informations requises
- Route cible (ex: `/applications/[id]`)
- Données affichées (quelle entité, quel hook TanStack Query)
- Actions disponibles sur cette page
- Layout cible : `(dashboard)` (protégé) ou `(auth)` (public)

### Étape 3 — Où créer la page

```
/pwa/app/
  (auth)/
    login/page.tsx          → /login  (public)
    register/page.tsx       → /register (public)
  (dashboard)/
    applications/
      page.tsx              → /applications
      [id]/page.tsx         → /applications/:id
      new/page.tsx          → /applications/new
    stats/page.tsx          → /stats
```

### Étape 4 — Structure obligatoire

Une page est un Server Component par défaut — elle orchestre, ne gère pas l'état.

```tsx
// /pwa/app/(dashboard)/applications/page.tsx
import { Suspense } from 'react'
import { ApplicationsList } from '@/components/applications-list'
import { ApplicationsListSkeleton } from '@/components/applications-list-skeleton'

export const metadata = {
  title: 'Candidatures — Working On It',
}

export default function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Candidatures</h1>
        {/* Action principale */}
      </div>

      <Suspense fallback={<ApplicationsListSkeleton />}>
        <ApplicationsList />
      </Suspense>
    </div>
  )
}
```

**Page avec paramètre dynamique :**
```tsx
// /pwa/app/(dashboard)/applications/[id]/page.tsx
import { notFound } from 'next/navigation'
import { ApplicationDetail } from '@/components/application-detail'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ApplicationPage({ params }: Props) {
  const { id } = await params
  return <ApplicationDetail id={id} />
}
```

**Composant client pour les données (TanStack Query) :**
```tsx
'use client'
// /pwa/app/components/applications-list.tsx
import { useApplications } from '@working-on-it/shared'
import { ApplicationCard } from './application-card'

export function ApplicationsList() {
  const { data, isLoading, isError } = useApplications()

  if (isLoading) return <ApplicationsListSkeleton />
  if (isError) return <p className="text-destructive">Erreur de chargement</p>
  if (!data?.items.length) return <EmptyState />

  return (
    <div className="grid gap-4">
      {data.items.map((app) => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  )
}
```

### Étape 5 — Règles spécifiques

- ✅ Page = Server Component par défaut
- ✅ `Suspense` + skeleton pour le loading
- ✅ `notFound()` si la ressource n'existe pas
- ✅ `metadata` exporté pour le SEO
- ✅ Données via TanStack Query dans les composants client enfants
- ❌ Pas de `'use client'` sur la page sauf si absolument nécessaire
- ❌ Pas de logique métier dans la page
- ❌ Pas de `fetch` direct dans la page

### Étape 6 — Checklist

- [ ] Page dans le bon groupe de routes (`(auth)` ou `(dashboard)`)
- [ ] Middleware Next.js protège les routes `(dashboard)` (déjà configuré globalement)
- [ ] `Suspense` avec fallback skeleton
- [ ] `metadata` exporté
- [ ] États vides (empty state) gérés dans le composant enfant
- [ ] `notFound()` si ressource introuvable
- [ ] Zéro logique métier dans la page
- [ ] Zéro style inline
