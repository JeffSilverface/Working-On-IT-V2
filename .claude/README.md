# Working On It — Setup Claude Code

## Vue d'ensemble

```
working-on-it/
  ├── CLAUDE.md                          → Règles absolues + architecture
  ├── DESIGN.md                          → Design system complet
  └── .claude/
        └── commands/
              ├── Commandes slash ──────────────────────────
              ├── new-component.md       → Créer un composant (atom/molecule/organism)
              ├── new-page.md            → Créer une page Next.js (App Router)
              ├── new-form.md            → Créer un formulaire (React Hook Form + Zod)
              ├── new-api-route.md       → Créer un endpoint NestJS
              ├── feature-pwa.md         → Feature complète (backend + frontend)
              ├── audit.md               → Auditer un composant
              │
              └── Agents experts ───────────────────────────
                  agent-frontend.md      → Next.js 15, React 19, TanStack Query, Zustand
                  agent-backend.md       → NestJS, Prisma, Better Auth
                  agent-uxui.md          → Conseil design, accessibilité
                  agent-test.md          → Jest + RTL + Playwright
                  agent-devops.md        → o2switch, CI/CD, PM2
                  agent-security.md      → Auth, validation, protection API
                  agent-perf.md          → Bundle, Core Web Vitals, N+1
```

---

## Commandes slash

| Commande          | Usage                                                      |
| ----------------- | ---------------------------------------------------------- |
| `/new-component`  | Composant UI (atom, molecule, organism, template)          |
| `/new-page`       | Page Next.js App Router                                    |
| `/new-form`       | Formulaire React Hook Form + Zod                           |
| `/new-api-route`  | Endpoint NestJS avec auth + Prisma                         |
| `/feature-pwa`    | Feature complète (NestJS endpoint + hook + page)           |
| `/audit`          | Auditer et corriger un composant existant                  |

---

## Agents experts

| Agent          | Invoquer avec                      | Rôle                                    |
| -------------- | ---------------------------------- | --------------------------------------- |
| `@frontend`    | "En tant que @frontend..."         | Next.js, React, TanStack Query, Zustand |
| `@backend`     | "En tant que @backend..."          | NestJS, Prisma, Better Auth             |
| `@uxui`        | "En tant que @uxui..."             | Conseil design, accessibilité           |
| `@test`        | "En tant que @test..."             | Jest + RTL + Playwright                 |
| `@devops`      | "En tant que @devops..."           | o2switch, CI/CD, PM2                    |
| `@security`    | "En tant que @security..."         | Auth, validation, sécurité              |
| `@perf`        | "En tant que @perf..."             | Bundle, Core Web Vitals, N+1            |

---

## Architecture

```
working-on-it/
  ├── /backend      → NestJS + Prisma + PostgreSQL
  ├── /pwa          → Next.js 15 + React 19 (App Router)
  ├── /landing      → Astro (site vitrine)
  └── /packages
        ├── /shared → Schémas Zod + types + TanStack Query hooks
        └── /core   → Stores Zustand (UI state)
```

---

## Workflow recommandé

### Nouvelle feature complète
```
/feature-pwa <nom>    → endpoint NestJS + hook TanStack Query + page Next.js
```

### Nouveau composant
```
/new-component        → atom (wrapper shadcn + CVA) / molecule / organism
```

### Besoin d'un expert spécifique
```
"En tant que @backend, crée l'endpoint pour les stats"
"En tant que @security, audite les routes API existantes"
"En tant que @uxui, analyse le flow d'ajout de candidature"
"En tant que @perf, identifie les requêtes N+1"
```

### Avant une PR
```
/audit <fichier>                          → violations des règles
"En tant que @security, vérifie cette route API"
"En tant que @test, génère les tests pour ce hook"
```
