# Working On It — CLAUDE.md

## ⚠️ RÈGLES ABSOLUES — LIRE EN PREMIER

Ces règles sont non-négociables. Toute génération de code doit les respecter avant d'être livrée.

### R1 — Architecture atomique : atoms → molecules → organisms

shadcn/ui est installé directement dans la PWA via CLI. Les composants générés vont dans `components/ui/` — ne jamais les modifier. Les atoms les wrappent pour appliquer le design system, les variants, les animations et les loaders de l'app.

```
pwa/app/components/
  ui/         → Primitifs shadcn générés par CLI (ne jamais modifier, ne jamais importer dans les organisms)
  atoms/      → Wrappers stylisés avec CVA : variants, animations, loaders, label/error
               Button, Input, InputField, Card, Badge, Avatar, Select, SelectField...
  molecules/  → Combinaisons d'atoms (SearchBar, StatusBadge, ScoreStars...)
  organisms/  → Composants métier (ApplicationCard, ApplicationForm...)
  templates/  → Shells de page (DashboardShell, AuthShell...)
```

**Règle de priorité :**
```typescript
// 1. Toujours importer depuis atoms/ dans les molecules et organisms
import { Button } from "@/components/atoms/button"
import { InputField } from "@/components/atoms/input-field"

// 2. components/ui/ = source interne des atoms uniquement
// ❌ JAMAIS importer depuis components/ui/ dans un organism ou molecule
import { Button } from "@/components/ui/button"  // ← réservé aux atoms

// ❌ JAMAIS recréer variants/loaders/animations dans un organism
<button className="bg-primary rounded-xl animate-spin">  // ← ça appartient à l'atom
```

**Ce que les atoms centralisent :**
```tsx
// components/atoms/button.tsx — exemple complet
const buttonVariants = cva("rounded-xl font-semibold transition-all active:scale-95", {
  variants: {
    variant: {
      primary: "bg-primary text-white shadow-orange hover:bg-primary/90 hover:-translate-y-0.5",
      secondary: "bg-surface border border-border hover:bg-muted",
      danger: "bg-destructive text-white hover:bg-destructive/90",
    },
    size: { sm: "h-8 px-3 text-sm", md: "h-10 px-4", lg: "h-12 px-6" },
  },
  defaultVariants: { variant: "primary", size: "md" },
})

export function Button({ variant, size, isLoading, children, className, ...props }: Props) {
  return (
    <ShadcnButton className={cn(buttonVariants({ variant, size }), className)} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Chargement...</> : children}
    </ShadcnButton>
  )
}
```

Primitifs shadcn (`components/ui/`, ne pas importer hors des atoms) :
`Alert Dialog` · `Avatar` · `Badge` · `Button` · `Card` · `Dialog` · `Input` · `Label` · `Select` · `Separator` · `Sonner` · `Textarea` · `Tooltip`

Atom manquant → créer dans `components/atoms/` avant d'utiliser dans un organism.

---

### R2 — Styling : Tailwind uniquement, zéro style inline

```tsx
{/* ✅ TOUJOURS */}
<button className="bg-primary text-white">

{/* ❌ JAMAIS */}
<button style={{ background: '#F97316' }}>
```

---

### R3 — Zéro classe CSS hardcodée en variable JS

```typescript
// ❌ JAMAIS
const inputClass = "bg-surface border-none rounded-lg px-4..."

// ✅ Classes Tailwind directement dans le JSX
```

---

### R4 — Un composant = une responsabilité

Un composant ne fait jamais plus d'une chose parmi :

- Afficher une liste
- Afficher un détail
- Gérer un formulaire
- Gérer le layout

Toujours extraire header / nav / sidebar hors du layout en composants dédiés.

---

### R5 — Zéro logique métier dans les composants React

```typescript
// ❌ JAMAIS dans un composant
const filtered = applications.filter(a => a.status === 'SENT').sort(...)

// ✅ TOUJOURS via TanStack Query + hook partagé
import { useApplications } from "@working-on-it/shared"
const { data } = useApplications({ status: 'SENT' })
```

---

### R6 — Appels API : toujours via TanStack Query

```typescript
// ✅ TOUJOURS — TanStack Query via hooks partagés dans packages/shared
import { useApplications, useCreateApplication } from "@working-on-it/shared"

const { data, isLoading } = useApplications()
const { mutate: createApplication } = useCreateApplication()

// ❌ JAMAIS de fetch direct dans un composant
const res = await fetch('/api/applications')
```

---

### R7 — État global UI : Zustand uniquement

```typescript
// ✅ TOUJOURS pour l'état global UI (ex: sidebar ouverte, thème, filtres actifs)
import { useUIStore } from "@working-on-it/core"
const { sidebarOpen, setSidebarOpen } = useUIStore()

// État serveur (données API) → TanStack Query, pas Zustand
// ❌ JAMAIS stocker des données API dans Zustand
```

---

### R8 — Validation : Zod partagé + nestjs-zod pour les DTOs NestJS

```typescript
// ✅ Schéma défini UNE SEULE FOIS dans packages/shared
// packages/shared/src/schemas/application.schema.ts
export const CreateApplicationSchema = z.object({
  company: z.string().min(1).max(200),
  status: z.nativeEnum(ApplicationStatus),
})

// ✅ DTO NestJS hérite du schéma Zod partagé
import { createZodDto } from 'nestjs-zod'
import { CreateApplicationSchema } from '@working-on-it/shared'
export class CreateApplicationDto extends createZodDto(CreateApplicationSchema) {}

// ✅ Validation frontend via le même schéma
import { CreateApplicationSchema } from "@working-on-it/shared"
const form = useForm({ resolver: zodResolver(CreateApplicationSchema) })

// ❌ JAMAIS deux schémas distincts pour le même objet
```

---

### R9 — Variables d'environnement : toujours via `@nestjs/config`

```typescript
// ✅ Backend — validation au démarrage, crash si manquant
ConfigModule.forRoot({ validate: (config) => envSchema.parse(config) })

// ✅ Frontend — via next.config.ts (env publiques) ou process.env côté server
// ❌ JAMAIS de valeur de fallback hardcodée dans le code source
```

---

### R10 — Checklist avant de livrer du code

- [ ] Atom wrappé utilisé en priorité sur le primitif shadcn direct
- [ ] Primitifs shadcn depuis `components/ui/` — jamais modifiés directement
- [ ] Zéro `style={}` inline
- [ ] Zéro variable de classe JS (`const inputClass = ...`)
- [ ] Composant avec une seule responsabilité
- [ ] Zéro logique métier dans le composant
- [ ] Zéro `fetch` direct — passer par TanStack Query
- [ ] Schéma Zod dans `packages/shared`, pas inline
- [ ] Décorateurs Swagger présents sur chaque DTO backend
- [ ] Chaque requête Prisma filtre par `userId` — jamais de `findUnique({ where: { id } })` seul
- [ ] Nommage fichier en `kebab-case`
- [ ] Nommage composant en `PascalCase`
- [ ] Zéro `any` TypeScript

---

## Fichiers de contexte

| Fichier     | Contenu                                           |
| ----------- | ------------------------------------------------- |
| `CLAUDE.md` | Architecture, stack, conventions, règles absolues |
| `DESIGN.md` | Design system, tokens, composants, variantes      |

> ⚠️ Lire `DESIGN.md` avant toute création ou modification de composant UI.

---

## Structure du monorepo

```
working-on-it/
  ├── /backend                  → NestJS + Prisma + PostgreSQL
  │   └── /src
  │       ├── /auth             → JWT access+refresh (strategy, guard, controller)
  │       ├── /applications     → CRUD candidatures
  │       │   ├── /dto          → DTOs NestJS (extends createZodDto)
  │       │   └── *.service.ts / *.controller.ts
  │       ├── /interviews       → CRUD entretiens
  │       ├── /attachments      → Upload pièces jointes
  │       ├── /stats            → Statistiques agrégées (cachées)
  │       ├── /user             → Profil utilisateur
  │       ├── /common
  │       │   ├── /decorators   → @CurrentUser, @Public
  │       │   ├── /guards       → AuthGuard, AppThrottlerGuard
  │       │   ├── /filters      → GlobalExceptionFilter
  │       │   └── mailer.ts     → nodemailer (SMTP o2switch)
  │       ├── /config           → @nestjs/config + validation Zod
  │       └── /prisma           → PrismaService
  │
  ├── /pwa                      → Next.js 15 + React 19 (App Router)
  │   └── /app
  │       ├── /(auth)/          → Pages publiques (login, register)
  │       ├── /(dashboard)/     → Pages protégées (layout partagé)
  │       │   ├── layout.tsx    → Layout dashboard (sidebar, header)
  │       │   ├── applications/ → Pages candidatures
  │       │   └── stats/        → Pages statistiques
  │       ├── /components
  │       │   ├── /ui           → Primitifs shadcn (générés par CLI, ne pas modifier)
  │       │   ├── /atoms        → Wrappers contextuels (InputField, SelectField...)
  │       │   ├── /molecules    → Combinaisons d'atoms (SearchBar, StatusBadge...)
  │       │   ├── /organisms    → Composants métier (ApplicationCard, ApplicationForm...)
  │       │   └── /templates    → Shells de page (DashboardShell, AuthShell...)
  │       └── /hooks            → Hooks spécifiques web
  │
  ├── /landing                  → Astro (pages primitives, pas de composants partagés)
  │   └── /src
  │       ├── /pages
  │       └── /layouts
  │
  └── /packages
        ├── /shared             → Logique partagée (@working-on-it/shared)
        │   └── /src
        │       ├── /schemas    → Schémas Zod (source de vérité validation)
        │       ├── /types      → Types TypeScript inférés depuis Zod
        │       ├── /hooks      → TanStack Query hooks (useApplications...)
        │       └── /utils      → formatDate, getStatusLabel, getStatusColor...
        └── /core               → État global UI (@working-on-it/core)
            └── /src
                └── /stores     → Zustand stores (UI state uniquement)
```

---

## Règle de création de fichier

| Type                      | Où créer                                  | Exemple                         |
| ------------------------- | ----------------------------------------- | ------------------------------- |
| Primitif shadcn (CLI)     | `/pwa/app/components/ui/`                 | `button.tsx` (généré par CLI)   |
| Atom wrappé               | `/pwa/app/components/atoms/`              | `input-field.tsx`               |
| Molecule                  | `/pwa/app/components/molecules/`          | `search-bar.tsx`                |
| Organism métier           | `/pwa/app/components/organisms/`          | `application-card.tsx`          |
| Template shell            | `/pwa/app/components/templates/`          | `dashboard-shell.tsx`           |
| Layout Next.js            | `/pwa/app/(dashboard)/layout.tsx`         | `layout.tsx`                    |
| Page Next.js              | `/pwa/app/(dashboard)/applications/`| `page.tsx`                      |
| Hook partagé              | `/packages/shared/src/hooks/`       | `use-applications.ts`           |
| Schéma Zod                | `/packages/shared/src/schemas/`     | `application.schema.ts`         |
| Type partagé              | `/packages/shared/src/types/`       | `application.ts`                |
| Store Zustand             | `/packages/core/src/stores/`        | `ui.store.ts`                   |
| Controller NestJS         | `/backend/src/<resource>/`          | `applications.controller.ts`    |
| Service NestJS            | `/backend/src/<resource>/`          | `applications.service.ts`       |
| DTO NestJS                | `/backend/src/<resource>/dto/`      | `create-application.dto.ts`     |

---

## Stack technique

### /backend — API

| Couche           | Techno                                                       |
| ---------------- | ------------------------------------------------------------ |
| Framework        | NestJS                                                       |
| ORM              | Prisma                                                       |
| Base de données  | PostgreSQL (o2switch)                                        |
| Auth             | `@nestjs/jwt` + Passport (JWT access + refresh, cookies httpOnly) |
| Validation       | Zod via `nestjs-zod` + schémas `@working-on-it/shared`       |
| Documentation    | Swagger (`@nestjs/swagger`) — décorateurs manuels            |
| Config           | `@nestjs/config` + validation Zod au boot                    |
| Rate limiting    | `@nestjs/throttler` + `AppThrottlerGuard` (X-Forwarded-For)  |
| Scheduling       | `@nestjs/schedule` (rappels, relances auto)                  |
| Events           | `@nestjs/event-emitter` (statut changé → email)              |
| Health check     | `@nestjs/terminus` (`/health`)                               |
| Cache            | `@nestjs/cache-manager` (stats)                              |
| Sécurité headers | Helmet                                                       |
| Email            | nodemailer (SMTP o2switch)                                   |
| Hébergement      | o2switch (cPanel Node.js Selector + Passenger)               |

### /pwa — Frontend web

| Couche           | Techno                              |
| ---------------- | ----------------------------------- |
| Framework        | Next.js 15 + React 19 (App Router)  |
| Styling          | Tailwind CSS                        |
| Composants UI    | `@working-on-it/ui` (shadcn/ui)     |
| État serveur     | TanStack Query v5                   |
| État global UI   | Zustand (`@working-on-it/core`)     |
| Formulaires      | React Hook Form + Zod               |
| Auth client      | Cookies httpOnly (access + refresh JWT), pas de stockage token côté JS |

### /landing — Site vitrine

| Couche      | Techno            |
| ----------- | ----------------- |
| Framework   | Astro             |
| Composants  | React (islands)   |
| Styling     | Tailwind CSS      |

---

## Plateformes cibles

| Plateforme | Priorité | Techno       | Notes                 |
| ---------- | -------- | ------------ | --------------------- |
| PWA        | 1        | Next.js 15   | Déployée sur o2switch |
| Landing    | 2        | Astro        | Site vitrine          |

---

## CI — GitHub Actions

Pipeline déclenché sur chaque push et pull request.

```
Jobs:
├── quality   → ESLint + TypeScript (tsc --noEmit) sur tous les packages
├── test      → Jest (backend) + Vitest (pwa/landing/packages)
├── build     → nest build + next build + astro build
└── security  → pnpm audit --audit-level=high + Snyk + SonarCloud
```

- Repo **public** → SonarCloud gratuit, minutes CI illimitées
- `SNYK_TOKEN` + `SONAR_TOKEN` dans les secrets GitHub

---

## Modèle de données

### ApplicationStatus

```typescript
enum ApplicationStatus {
  DRAFT = "DRAFT",         // Brouillon  — offre repérée, pas encore postulée
  SENT = "SENT",           // Envoyée    — candidature envoyée
  FOLLOW_UP = "FOLLOW_UP", // Relance    — relance effectuée sans réponse
  INTERVIEW = "INTERVIEW", // Entretien  — entretien planifié ou passé
  OFFER = "OFFER",         // Offre      — proposition reçue
  REJECTED = "REJECTED",   // Refusée    — l'employeur a refusé
  DECLINED = "DECLINED",   // Déclinée   — j'ai refusé l'offre
}
```

Flux :

```
DRAFT → SENT → FOLLOW_UP → INTERVIEW → OFFER → REJECTED (employeur)
                                              ↘ DECLINED (moi)
                         ↘ REJECTED
              ↘ REJECTED
```

### Application

```typescript
interface Application {
  id: string
  company: string
  position: string
  location: string
  contractType: string
  salary: string
  offerUrl: string
  source: string
  status: ApplicationStatus
  score: number         // 1–5
  tags: string[]
  contact: Contact | null
  interviews: Interview[]
  attachments: Attachment[]
  followUps: FollowUp[]
  reminderAt: Date | null
  notes: string
  appliedAt: Date
  updatedAt: Date
  createdAt: Date
}
```

### Autres modèles

```typescript
interface Contact {
  id: string
  name: string
  email: string
  phone: string
}

interface Interview {
  id: string
  date: Date
  type: InterviewType   // PHONE | VIDEO | ONSITE
  location: string
  contact: string
  notes: string
  createdAt: Date
}

interface Attachment {
  id: string
  name: string
  type: string
  size: number
  path: string
  createdAt: Date
}

interface FollowUp {
  id: string
  date: Date
  note: string
}
```

---

## Auth — JWT (access + refresh)

- `@nestjs/jwt` + Passport (`passport-jwt`) — pas Better Auth (conçu pour les sessions, pas pour ce pattern)
- **Access token** JWT courte durée (15 min), stateless — validé par signature seule, aucun call DB par requête
- **Refresh token** opaque (random, pas JWT), stocké hashé en DB, longue durée — révocable (logout forcé, ban compte, changement de mot de passe = suppression en DB)
- Les deux transmis en cookies `httpOnly`, `sameSite: lax`, `secure` en prod
- Routes protégées via `AuthGuard` global NestJS + décorateur `@Public()` pour les exceptions
- Email vérifié obligatoire avant connexion
- Google OAuth via `passport-google-oauth20`, lié au compte existant si email déjà présent

---

## Conventions de code

- **TypeScript strict** partout — pas de `any`
- **React 19** — Server Components par défaut, `'use client'` uniquement si nécessaire
- Nommage composants : `PascalCase`
- Nommage fichiers : `kebab-case`
- Nommage hooks : `camelCase` + préfixe `use`
- Un composant = un fichier
- NestJS : un module par ressource métier
- Schémas Zod dans `packages/shared` — jamais inline dans un controller ou service
- TanStack Query hooks dans `packages/shared/src/hooks/` — jamais de `fetch` direct dans un composant

---

## À ne jamais faire

- ❌ Importer depuis `components/ui/` dans un organism ou molecule — passer par `components/atoms/`
- ❌ Définir des variants de style (couleurs, tailles, animations) dans un organism — appartient à l'atom
- ❌ Variants sans CVA — jamais de classes conditionnelles ternaires pour les styles
- ❌ `style={}` inline dans les composants React
- ❌ Variables de classes JS (`const inputClass = "..."`)
- ❌ Logique métier dans les composants React
- ❌ `fetch`/`axios` direct dans un composant — passer par TanStack Query
- ❌ Données API dans Zustand — Zustand = état UI uniquement
- ❌ `any` en TypeScript
- ❌ `process.env.X` direct dans un service NestJS — passer par `@nestjs/config`
- ❌ Valeur de fallback hardcodée pour une variable d'env (`?? 'http://localhost:...'`)
- ❌ Schéma Zod défini deux fois — un seul dans `packages/shared`
- ❌ Access token JWT longue durée sans refresh token révocable en DB
- ❌ Stocker le refresh token en clair en DB — toujours hashé
- ❌ Anciens statuts : TO_APPLY, APPLIED, ACCEPTED, ABANDONED
- ❌ `findUnique({ where: { id } })` seul — toujours `findFirst({ where: { id, userId } })`
- ❌ Retourner des données sans vérifier que `userId` correspond à l'utilisateur connecté
