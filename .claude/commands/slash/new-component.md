# /new-component

Crée un nouveau composant React pour Working On It selon l'architecture atomique.

## Protocole obligatoire

### Étape 1 — Lire les fichiers de contexte
Lire `CLAUDE.md` et `DESIGN.md` avant toute génération.

### Étape 2 — Classifier le composant

| Niveau      | Où créer                              | Quoi                                                        |
| ----------- | ------------------------------------- | ----------------------------------------------------------- |
| ui          | `/pwa/app/components/ui/`             | Primitifs shadcn générés par CLI — ne jamais créer à la main |
| atom        | `/pwa/app/components/atoms/`          | Wrapper d'un primitif shadcn + logique contextuelle          |
| molecule    | `/pwa/app/components/molecules/`      | Combinaison d'atoms avec une responsabilité précise          |
| organism    | `/pwa/app/components/organisms/`      | Composant métier complet (ApplicationCard, ApplicationForm...) |
| template    | `/pwa/app/components/templates/`      | Shell de page (DashboardShell, AuthShell...)                 |

**Règle de décision :**
- Wrapping d'un seul primitif shadcn + label/error → **atom**
- Combinaison de plusieurs atoms → **molecule**
- Logique métier + données de l'API → **organism**
- Structure de page réutilisable → **template**

### Étape 3 — Choisir Server ou Client Component

```tsx
// Server Component (défaut) — composants présentationnels sans interactivité
export function ApplicationCard({ application }: Props) { ... }

// Client Component — uniquement si useState / événements / TanStack Query / Zustand
'use client'
export function ApplicationStatusSelect({ application }: Props) { ... }
```

### Étape 4 — Templates par niveau

**Atom — wrapper stylisé avec CVA + variants + loader :**
```tsx
// /pwa/app/components/atoms/button.tsx
import { Button as ShadcnButton } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "rounded-xl font-semibold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:   "bg-primary text-white shadow-orange hover:bg-primary/90 hover:-translate-y-0.5",
        secondary: "bg-surface border border-border hover:bg-muted",
        ghost:     "hover:bg-muted hover:scale-105",
        danger:    "bg-destructive text-white hover:bg-destructive/90",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
)

interface Props
  extends React.ComponentProps<typeof ShadcnButton>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

export function Button({ variant, size, isLoading, children, className, ...props }: Props) {
  return (
    <ShadcnButton
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement...
        </span>
      ) : (
        children
      )}
    </ShadcnButton>
  )
}
```

**Atom — wrapper avec label/error/aria (InputField) :**
```tsx
// /pwa/app/components/atoms/input-field.tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label?: string
  error?: string
  description?: string
}

export function InputField({ id, label, error, description, className, ...rest }: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
```

**Molecule — combinaison d'atoms :**
```tsx
// /pwa/app/components/molecules/status-badge.tsx
import { Badge } from "@/components/ui/badge"
import type { ApplicationStatus } from "@working-on-it/shared"

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; variant: 'default' | 'outline' | 'destructive' }> = {
  DRAFT:      { label: 'Brouillon',  variant: 'outline' },
  SENT:       { label: 'Envoyée',    variant: 'default' },
  FOLLOW_UP:  { label: 'Relance',    variant: 'default' },
  INTERVIEW:  { label: 'Entretien',  variant: 'default' },
  OFFER:      { label: 'Offre',      variant: 'default' },
  REJECTED:   { label: 'Refusée',    variant: 'destructive' },
  DECLINED:   { label: 'Déclinée',   variant: 'outline' },
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const { label, variant } = STATUS_CONFIG[status]
  return <Badge variant={variant}>{label}</Badge>
}
```

**Organism — composant métier (Server Component) :**
```tsx
// /pwa/app/components/organisms/application-card.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { StatusBadge } from "@/components/molecules/status-badge"
import type { Application } from "@working-on-it/shared"

export function ApplicationCard({ application }: { application: Application }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <div>
          <p className="font-semibold">{application.company}</p>
          <p className="text-sm text-muted-foreground">{application.position}</p>
        </div>
        <StatusBadge status={application.status} />
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{application.location}</p>
      </CardContent>
    </Card>
  )
}
```

### Étape 5 — Checklist avant livraison

- [ ] Fichier nommé en `kebab-case.tsx`
- [ ] Export nommé (pas de default export sauf pages Next.js)
- [ ] Niveau correct (atom / molecule / organism / template)
- [ ] `'use client'` uniquement si hooks / événements nécessaires
- [ ] **Atom** : importe depuis `components/ui/`, expose CVA variants + loader si bouton
- [ ] **Molecule/Organism** : importe depuis `components/atoms/` — jamais depuis `components/ui/`
- [ ] Variants définis avec CVA (`cva()`), jamais de classes conditionnelles inline
- [ ] Zéro `style={}` inline
- [ ] Zéro `const xxxClass = "..."`
- [ ] Une seule responsabilité
- [ ] Zéro logique métier dans un atom ou molecule
- [ ] Zéro `fetch` direct — TanStack Query dans les organisms client
- [ ] Props typées, zéro `any`
- [ ] États interactifs : `hover:`, `focus-visible:`, `active:`, `disabled:`
- [ ] `aria-invalid`, `aria-describedby` sur les champs avec erreur

## Réponse attendue

1. Niveau (atom / molecule / organism / template) + chemin
2. Server Component ou Client Component (et pourquoi)
3. Fichier complet généré
4. Si primitif shadcn manquant → commande CLI à exécuter : `pnpm dlx shadcn@latest add <composant>`
