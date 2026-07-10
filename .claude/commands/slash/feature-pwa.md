# /feature-pwa

Crée une feature complète pour la PWA (Next.js 15 + NestJS).

## Déclenchement
```
/feature-pwa <nom-de-la-feature>
```

## Protocole

### Phase 1 — Lecture du contexte
1. Lire `CLAUDE.md` et `DESIGN.md`
2. Lire la structure de `/pwa/app/` et `/backend/src/`
3. Identifier les hooks TanStack Query existants dans `/packages/shared/src/hooks/`
4. Identifier les endpoints NestJS existants dans `/backend/src/`

### Phase 2 — Plan

```
## Plan — feature-pwa : <nom>

### Endpoints NestJS à créer dans /backend/src/<resource>/
- applications.controller.ts (GET, POST, PATCH, DELETE)
- applications.service.ts
- dto/create-application.dto.ts

### Schémas Zod à créer dans /packages/shared/src/schemas/
- application.schema.ts

### Hooks TanStack Query à créer dans /packages/shared/src/hooks/
- use-applications.ts

### Atoms à créer dans /pwa/app/components/atoms/ (si manquants)
- input-field.tsx

### Molecules à créer dans /pwa/app/components/molecules/
- status-badge.tsx

### Organisms à créer dans /pwa/app/components/organisms/
- application-card.tsx
- application-form.tsx

### Pages à créer dans /pwa/app/(dashboard)/
- applications/page.tsx
- applications/[id]/page.tsx
- applications/new/page.tsx

### Points d'attention
- Routes NestJS privées par défaut (AuthGuard global)
- findFirst({ where: { id, userId } }) — jamais findUnique seul
- Atoms importés depuis components/atoms/, jamais depuis components/ui/
- Suspense + skeleton sur chaque page
- États loading / empty / error gérés
```

### Phase 3 — Ordre de génération

1. **Schéma Zod** dans `/packages/shared/src/schemas/`
2. **DTO NestJS** dans `/backend/src/<resource>/dto/` (extends createZodDto)
3. **Service NestJS** dans `/backend/src/<resource>/`
4. **Controller NestJS** dans `/backend/src/<resource>/`
5. **Hook TanStack Query** dans `/packages/shared/src/hooks/`
6. **Atoms manquants** dans `/pwa/app/components/atoms/`
7. **Molecules** dans `/pwa/app/components/molecules/`
8. **Organisms** dans `/pwa/app/components/organisms/`
9. **Pages** dans `/pwa/app/(dashboard)/`

### Phase 4 — Checklist

**Backend**
- [ ] Route privée par défaut — `@Public()` uniquement si nécessaire
- [ ] `findFirst({ where: { id, userId } })` sur toutes les ressources par ID
- [ ] `userId` dans tous les `findMany`
- [ ] DTO via `createZodDto(SchemaDepuisShared)`
- [ ] Décorateurs Swagger présents
- [ ] Catch P2025 sur update() et delete()

**Frontend**
- [ ] Schéma Zod dans `packages/shared/` — pas inline
- [ ] Données via TanStack Query hooks — zéro `fetch` direct
- [ ] Atoms depuis `components/atoms/` — jamais depuis `components/ui/`
- [ ] CVA pour les variants dans les atoms
- [ ] `Suspense` + skeleton sur chaque page
- [ ] États empty / error gérés
- [ ] Formulaires via React Hook Form + zodResolver
- [ ] Zéro style inline, zéro variable de classes
- [ ] TypeScript strict — zéro `any`
