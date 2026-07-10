# /audit

Audite un composant ou une page React existante et liste les violations.

## Protocole
Lire `CLAUDE.md` et `DESIGN.md` avant l'audit.

## Règles à vérifier

### R1 — Imports UI
- [ ] Tous les imports UI depuis `@working-on-it/ui`
- [ ] Zéro import depuis `shadcn/ui` ou chemins locaux (`@/components/ui/`)

### R2 — Styles inline
- [ ] Zéro `style={}` dans le JSX

### R3 — Variables de classes JS
- [ ] Zéro `const xxxClass = "..."`

### R4 — Responsabilité unique
- [ ] Le composant ne fait qu'une seule chose

### R5 — Logique métier
- [ ] Zéro `filter()`, `sort()`, `reduce()` sur des données API dans le composant
- [ ] Zéro transformation de données dans le JSX

### R6 — Appels API
- [ ] Zéro `fetch` / `axios` direct dans les composants
- [ ] Tout passe par TanStack Query hooks depuis `@working-on-it/shared`

### R7 — Server vs Client Component
- [ ] `'use client'` présent uniquement si useState / useEffect / événements / TanStack Query
- [ ] Pas de `'use client'` inutile sur un composant purement présentationnel

### R8 — TypeScript
- [ ] Zéro `any`
- [ ] Props typées avec interface ou type
- [ ] Pas de type assertion inutile (`as any`)

### R9 — Données API dans Zustand
- [ ] Aucune donnée venant de l'API stockée dans Zustand
- [ ] Zustand = état UI uniquement (sidebar, filtres actifs, modals...)

### R10 — Formulaires
- [ ] React Hook Form + zodResolver avec schéma depuis `@working-on-it/shared`
- [ ] Pas de `useState` manuel pour chaque champ de formulaire
- [ ] Erreurs affichées via `form.formState.errors`

## Format du rapport

```
## Audit — NomDuComposant.tsx

### ✅ Conforme
- R1, R3, R8 : OK

### ❌ Violations

**R2 — Style inline (ligne 42)**
Code actuel :
  <Button style={{ background: '#F97316' }}>
Correction :
  <Button className="bg-primary text-white">

**R6 — fetch direct (ligne 18)**
Code actuel :
  const res = await fetch('/api/applications')
Correction :
  import { useApplications } from '@working-on-it/shared'
  const { data } = useApplications()

**R7 — 'use client' inutile**
Ce composant ne contient aucun hook ou événement.
Supprimer 'use client' → Server Component.

### 📋 Plan de correction
1. Supprimer 'use client' — Server Component suffisant
2. Remplacer styles inline → classes Tailwind
3. Remplacer fetch → hook useApplications
Priorité : Haute
```
