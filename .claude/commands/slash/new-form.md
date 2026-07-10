# /new-form

Crée un composant formulaire React pour Working On It.

## Protocole obligatoire

### Étape 1 — Lire les fichiers de contexte
Lire `CLAUDE.md` et `DESIGN.md` avant toute génération.

### Étape 2 — Informations requises
- Entité concernée (Application, Interview, Contact...)
- Mode : création / édition / les deux
- Action après soumission (redirect, toast, fermer modal...)

### Étape 3 — Structure obligatoire

Un formulaire est toujours un Client Component (React Hook Form nécessite `'use client'`).

```tsx
'use client'
// /pwa/app/components/application-form.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button, Input, Label, Textarea, Select,
         SelectContent, SelectItem, SelectTrigger, SelectValue } from '@working-on-it/ui'
import {
  CreateApplicationSchema,
  type CreateApplicationInput,
  type Application,
} from '@working-on-it/shared'
import { useCreateApplication, useUpdateApplication } from '@working-on-it/shared'

interface Props {
  application?: Application  // undefined = création, défini = édition
  onSuccess?: (id: string) => void
}

export function ApplicationForm({ application, onSuccess }: Props) {
  const router = useRouter()
  const isEdit = !!application

  const { mutate: create, isPending: isCreating } = useCreateApplication()
  const { mutate: update, isPending: isUpdating } = useUpdateApplication()
  const isPending = isCreating || isUpdating

  const form = useForm<CreateApplicationInput>({
    resolver: zodResolver(CreateApplicationSchema),
    defaultValues: {
      company: application?.company ?? '',
      position: application?.position ?? '',
      status: application?.status ?? 'DRAFT',
      notes: application?.notes ?? '',
    },
  })

  function onSubmit(data: CreateApplicationInput) {
    if (isEdit) {
      update(
        { id: application.id, data },
        {
          onSuccess: () => {
            toast.success('Candidature mise à jour')
            onSuccess?.(application.id)
          },
          onError: () => toast.error('Erreur lors de la mise à jour'),
        },
      )
    } else {
      create(data, {
        onSuccess: (created) => {
          toast.success('Candidature créée')
          onSuccess?.(created.id) ?? router.push(`/applications/${created.id}`)
        },
        onError: () => toast.error('Erreur lors de la création'),
      })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

      <div className="space-y-2">
        <Label htmlFor="company">Entreprise *</Label>
        <Input
          id="company"
          placeholder="Ex: Stripe"
          {...form.register('company')}
          aria-invalid={!!form.formState.errors.company}
        />
        {form.formState.errors.company && (
          <p className="text-sm text-destructive">{form.formState.errors.company.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Poste</Label>
        <Input
          id="position"
          placeholder="Ex: Développeur Fullstack"
          {...form.register('position')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select
          value={form.watch('status')}
          onValueChange={(value) => form.setValue('status', value as ApplicationStatus)}
        >
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Brouillon</SelectItem>
            <SelectItem value="SENT">Envoyée</SelectItem>
            <SelectItem value="INTERVIEW">Entretien</SelectItem>
            <SelectItem value="OFFER">Offre</SelectItem>
            <SelectItem value="REJECTED">Refusée</SelectItem>
            <SelectItem value="DECLINED">Déclinée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" rows={4} {...form.register('notes')} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
        >
          Annuler
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Créer'}
        </Button>
      </div>

    </form>
  )
}
```

### Étape 4 — Règles

- ✅ `'use client'` obligatoire (React Hook Form)
- ✅ `zodResolver` avec schéma depuis `@working-on-it/shared`
- ✅ `defaultValues` pour le pré-remplissage en édition
- ✅ Mutations TanStack Query (`useCreateX`, `useUpdateX`)
- ✅ `toast.success` / `toast.error` via Sonner pour le feedback
- ✅ `aria-invalid` sur les inputs avec erreur
- ✅ `<Label htmlFor>` associé à chaque `<Input id>`
- ❌ Pas de validation manuelle — tout passe par Zod + React Hook Form
- ❌ Pas de `fetch` direct
- ❌ Pas de variables de classes JS
- ❌ Pas de style inline

### Étape 5 — Checklist

- [ ] `'use client'` présent
- [ ] `zodResolver(SchemaDepuisShared)` utilisé
- [ ] `defaultValues` pour édition
- [ ] Mutations TanStack Query avec `onSuccess` / `onError`
- [ ] Toast feedback sur succès et erreur
- [ ] Erreurs affichées sous chaque champ avec `form.formState.errors.X.message`
- [ ] `aria-invalid` sur les inputs en erreur
- [ ] Labels associés aux inputs (`htmlFor` + `id`)
- [ ] `disabled={isPending}` sur le bouton submit
- [ ] Tous les champs depuis `@working-on-it/ui`
- [ ] Zéro style inline, zéro variable de classes
