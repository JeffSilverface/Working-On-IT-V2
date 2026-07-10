# Working On It — DESIGN.md

> ⚠️ Lire ce fichier avant toute création ou modification de composant UI.
> Couleurs de référence : flow "Nouvelle candidature" (orange + crème).
> Structure des composants : board dashboard/liste/détail/stats.

---

## Principes

| Principe      | Description                                                       |
| ------------- | ----------------------------------------------------------------- |
| Chaleur       | Orange franc sur fond froid neutre — contraste thermique assumé   |
| Clarté        | Hiérarchie bold/regular bien marquée, peu de niveaux              |
| Progression   | Stepper, timeline, progress bar — l'utilisateur sait où il en est |
| Zéro friction | Formulaires multi-étapes courts, actions toujours visibles        |

---

## Couleurs — Light Mode

| Token            | Hex       | Usage                                        |
| ---------------- | --------- | -------------------------------------------- |
| `primary`        | `#F97316` | CTA, boutons principaux, éléments actifs     |
| `primary-dark`   | `#EA6C0A` | Hover / pressed sur primary                  |
| `primary-light`  | `#FFF0E6` | Fond badge primary, surfaces teintées orange |
| `bg`             | `#F9FAFB` | Fond général de l'app — gris neutre froid    |
| `surface`        | `#FFFFFF` | Cartes, inputs, panneaux                     |
| `surface-raised` | `#F3F4F6` | Cartes légèrement surélevées                 |
| `border`         | `#E5E7EB` | Bordures, séparateurs                        |
| `text-primary`   | `#111827` | Titres, texte principal                      |
| `text-secondary` | `#6B7280` | Texte secondaire, labels                     |
| `text-tertiary`  | `#9CA3AF` | Placeholders, texte désactivé                |
| `success`        | `#22C55E` | Statuts positifs, confirmations              |
| `success-light`  | `#DCFCE7` | Fond badge success                           |
| `warning`        | `#F59E0B` | Relances, alertes                            |
| `warning-light`  | `#FEF3C7` | Fond badge warning                           |
| `danger`         | `#EF4444` | Erreurs, refus                               |
| `danger-light`   | `#FEE2E2` | Fond badge danger                            |
| `info`           | `#6366F1` | Statut "Envoyée", éléments info (violet)     |
| `info-light`     | `#EEF2FF` | Fond badge info                              |

## Couleurs — Dark Mode

| Token            | Hex       | Notes                                                   |
| ---------------- | --------- | ------------------------------------------------------- |
| `primary`        | `#F97316` | Identique — l'orange ressort encore plus sur fond froid |
| `primary-light`  | `#3D1A00` | Seule touche chaude en dark — zones d'accent orange     |
| `bg`             | `#0D0D14` | Fond général — noir froid profond                       |
| `surface`        | `#16161E` | Cartes, inputs                                          |
| `surface-raised` | `#1E1E2A` | Cartes surélevées                                       |
| `border`         | `#2A2A38` | Bordures, séparateurs                                   |
| `text-primary`   | `#F1F5F9` | Blanc froid légèrement bleuté                           |
| `text-secondary` | `#8B92A5` | Gris-bleu secondaire                                    |
| `text-tertiary`  | `#4A5060` | Gris-bleu désactivé                                     |
| `success`        | `#22C55E` |                                                         |
| `success-light`  | `#052E16` |                                                         |
| `warning`        | `#F59E0B` |                                                         |
| `warning-light`  | `#451A03` |                                                         |
| `danger`         | `#EF4444` |                                                         |
| `danger-light`   | `#450A0A` |                                                         |
| `info`           | `#818CF8` |                                                         |
| `info-light`     | `#1E1B4B` |                                                         |

---

## Typographie

Police principale : **Inter**

| Niveau     | Taille | Weight | Classe Tailwind              | Usage                    |
| ---------- | ------ | ------ | ---------------------------- | ------------------------ |
| Display    | 28px   | 800    | `text-[28px] font-extrabold` | Titre onboarding         |
| Heading XL | 24px   | 700    | `text-2xl font-bold`         | Titre de page            |
| Heading L  | 20px   | 700    | `text-xl font-bold`          | Titre de section         |
| Heading M  | 17px   | 600    | `text-[17px] font-semibold`  | Titre de carte           |
| Body       | 15px   | 400    | `text-[15px]`                | Texte courant            |
| Small      | 13px   | 400    | `text-[13px]`                | Texte secondaire         |
| Caption    | 11px   | 500    | `text-[11px] font-medium`    | Labels, badges, captions |
| Label      | 12px   | 600    | `text-xs font-semibold`      | Labels de champs         |

---

## Espacement

Système en base 4 — multiples Tailwind standard :

| Tailwind | Valeur | Usage typique                     |
| -------- | ------ | --------------------------------- |
| `p-1`    | 4px    | Padding icône                     |
| `p-2`    | 8px    | Padding badge                     |
| `p-3`    | 12px   | Padding input compact             |
| `p-4`    | 16px   | Padding card, padding page        |
| `p-5`    | 20px   | Padding section                   |
| `p-6`    | 24px   | Padding modal, padding formulaire |
| `gap-3`  | 12px   | Gap entre champs de formulaire    |
| `gap-4`  | 16px   | Gap entre cartes                  |

---

## Border Radius

| Usage     | Valeur | Classe Tailwind  |
| --------- | ------ | ---------------- |
| Badge/Tag | 6px    | `rounded-md`     |
| Input     | 10px   | `rounded-[10px]` |
| Card      | 14px   | `rounded-[14px]` |
| Button    | 12px   | `rounded-xl`     |
| Modal     | 20px   | `rounded-[20px]` |
| Pill/FAB  | 9999px | `rounded-full`   |

---

## Ombres

| Token    | Valeur CSS                         | Classe custom   | Usage           |
| -------- | ---------------------------------- | --------------- | --------------- |
| `card`   | `0 2px 8px rgba(0,0,0,0.06)`       | `shadow-card`   | Cartes liste    |
| `orange` | `0 4px 16px rgba(249,115,22,0.25)` | `shadow-orange` | Boutons primary |
| `lg`     | `0 8px 24px rgba(0,0,0,0.10)`      | `shadow-lg`     | Modals          |

---

## Composants

### Bouton CTA (signature visuelle de l'app)

Pleine largeur, toujours en bas de page ou de section.

```html
<button
  class="w-full bg-primary hover:bg-primary-dark active:scale-95 text-white
               font-bold text-[16px] rounded-xl py-4 shadow-orange transition-all"
>
  Commencer
</button>

<!-- Avec flèche -->
<button class="w-full bg-primary text-white font-bold rounded-xl py-4 shadow-orange">
  Continuer →
</button>
```

### Bouton Ghost (retour, annulation)

```html
<button variant="ghost" class="text-text-secondary font-semibold px-4 py-3">← Retour</button>
```

### Chips (type de contrat, filtres courts)

Pour les options courtes → chips horizontaux, pas de Select dropdown.

```html
<div class="flex gap-2 flex-wrap">
  <button
    v-for="type in OPTIONS"
    :key="type"
    type="button"
    class="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
    :class="selected === type
      ? 'bg-primary-light border-primary text-primary'
      : 'bg-surface border-border text-text-secondary'"
    @click="selected = type"
  >
    {{ type }}
  </button>
</div>
```

---

### Stepper (4 étapes)

Étapes : `['Infos', 'Détails', 'Fichiers', 'Résumé']`

```html
<div class="flex items-center px-4 py-3">
  <template v-for="(step, i) in steps" :key="i">
    <div class="flex flex-col items-center gap-1">
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
        :class="i < current
          ? 'bg-primary text-white'
          : i === current
            ? 'bg-primary text-white ring-4 ring-primary/20'
            : 'bg-border text-text-tertiary'"
      >
        <Check v-if="i < current" class="w-3.5 h-3.5" />
        <span v-else>{{ i + 1 }}</span>
      </div>
      <span
        class="text-[10px] font-medium"
        :class="i === current ? 'text-primary' : 'text-text-tertiary'"
      >
        {{ step }}
      </span>
    </div>
    <div
      v-if="i < steps.length - 1"
      class="flex-1 h-px mx-1 transition-all"
      :class="i < current ? 'bg-primary' : 'bg-border'"
    />
  </template>
</div>
```

---

### Badges de statut

Chaque statut a ses propres tokens CSS (`--color-s-<statut>` et `--color-s-<statut>-bg`) définis dans `variables.css`, avec variante light et dark.

| Statut    | Token text         | Token bg            | Light text | Light bg  | Label FR  |
| --------- | ------------------ | ------------------- | ---------- | --------- | --------- |
| DRAFT     | `text-s-draft`     | `bg-s-draft-bg`     | `#5C6B82`  | `#E8ECF2` | Brouillon |
| SENT      | `text-s-sent`      | `bg-s-sent-bg`      | `#5E52C8`  | `#ECEAFA` | Envoyée   |
| FOLLOW_UP | `text-s-followup`  | `bg-s-followup-bg`  | `#A06018`  | `#F8E8D0` | Relance   |
| INTERVIEW | `text-s-interview` | `bg-s-interview-bg` | `#1A8E78`  | `#D4F0EA` | Entretien |
| OFFER     | `text-s-offer`     | `bg-s-offer-bg`     | `#1660A8`  | `#D0E8F8` | Offre     |
| REJECTED  | `text-s-rejected`  | `bg-s-rejected-bg`  | `#C22842`  | `#FAD6DE` | Refusée   |
| DECLINED  | `text-s-declined`  | `bg-s-declined-bg`  | `#7268A0`  | `#EDEAF5` | Déclinée  |

```html
<span
  :class="[STATUS_CONFIG[status].bg, STATUS_CONFIG[status].text,
  'px-2.5 py-1 rounded-md text-xs font-semibold']"
>
  {{ STATUS_CONFIG[status].label }}
</span>
```

---

### ApplicationCard (liste)

```html
<div class="bg-surface rounded-[14px] px-4 py-3.5 shadow-card">
  <div class="flex items-center gap-3">
    <!-- Avatar entreprise -->
    <div
      class="w-10 h-10 rounded-xl flex items-center justify-center
                font-bold text-white text-sm flex-shrink-0"
      :style="{ backgroundColor: avatarColor }"
    >
      {{ company[0].toUpperCase() }}
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-2">
        <span class="font-semibold text-[15px] text-text-primary truncate">{{ company }}</span>
        <!-- Badge statut -->
        <span
          :class="statusBadgeClass + ' px-2.5 py-1 rounded-md text-xs font-semibold flex-shrink-0'"
        >
          {{ statusLabel }}
        </span>
      </div>
      <p class="text-[13px] text-text-secondary truncate mt-0.5">{{ position }}</p>
      <div class="flex items-center justify-between mt-1.5">
        <span class="text-[11px] text-text-tertiary">Envoyé le {{ date }}</span>
        <span v-if="hint" class="text-[11px] font-medium" :class="hintColor">● {{ hint }}</span>
      </div>
    </div>
  </div>
</div>
```

---

### Bottom Navigation

5 onglets : Dashboard · Candidatures · FAB (+) · Stats · Calendrier

```html
<nav
  class="fixed bottom-0 left-0 right-0 bg-surface border-t border-border
            pb-[env(safe-area-inset-bottom)]"
>
  <div class="flex items-center justify-around h-16 px-2">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors"
      :class="active === tab.name ? 'text-primary' : 'text-text-tertiary'"
      @click="navigate(tab)"
    >
      <component :is="tab.icon" class="w-5 h-5" />
      <span class="text-[10px] font-medium">{{ tab.label }}</span>
    </button>

    <!-- FAB central -->
    <button
      class="w-14 h-14 rounded-full bg-primary shadow-orange -mt-6
             flex items-center justify-center transition-transform active:scale-95"
      @click="openNewApplication"
    >
      <Plus class="w-6 h-6 text-white" />
    </button>
  </div>
</nav>
```

---

### Champs de saisie

```html
<div class="space-y-2">
  <label class="text-xs font-semibold text-text-secondary uppercase tracking-wide">
    Entreprise *
  </label>
  <input
    v-model="form.company"
    placeholder="Ex: Stripe"
    class="bg-surface border border-border rounded-[10px] px-4 py-3.5
           text-[15px] placeholder:text-text-tertiary
           focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
  />
  <p v-if="errors.company" class="text-xs text-danger">{{ errors.company }}</p>
</div>
```

États : `border-border` (default) → `border-primary ring-primary/10` (focus) → `border-danger ring-danger/10` (error)

---

### Upload de fichiers

```html
<!-- Zone de drop -->
<div
  class="border-2 border-dashed border-border rounded-[14px] p-8
            flex flex-col items-center gap-3 bg-surface text-center"
>
  <div class="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
    <Upload class="w-6 h-6 text-primary" />
  </div>
  <p class="text-[15px] font-semibold text-text-primary">Déposer tes fichiers ici</p>
  <p class="text-[13px] text-text-tertiary">
    ou
    <span class="text-primary font-medium cursor-pointer">parcourir</span>
  </p>
  <p class="text-[11px] text-text-tertiary">PDF, DOC, DOCX (max. 10 Mo)</p>
</div>

<!-- Fichier uploadé -->
<div class="flex items-center gap-3 p-3 bg-surface rounded-[10px] border border-border">
  <div class="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
    <FileText class="w-5 h-5 text-primary" />
  </div>
  <div class="flex-1 min-w-0">
    <p class="text-[13px] font-semibold text-text-primary truncate">{{ file.name }}</p>
    <p class="text-[11px] text-text-tertiary">{{ file.size }}</p>
  </div>
  <CheckCircle class="w-5 h-5 text-success flex-shrink-0" />
</div>
```

---

### Conseil / Info box

```html
<div class="bg-primary-light rounded-[12px] p-4 flex gap-3">
  <span class="text-xl">💡</span>
  <div>
    <p class="text-[13px] font-semibold text-primary mb-0.5">Conseil</p>
    <p class="text-[13px] text-text-secondary leading-relaxed">{{ message }}</p>
  </div>
</div>
```

---

### Timeline (détail candidature)

```html
<div class="relative pl-8">
  <div class="absolute left-3 top-2 bottom-2 w-px bg-border" />

  <div v-for="(event, i) in timeline" :key="i" class="relative mb-5 last:mb-0">
    <div
      class="absolute -left-[19px] w-5 h-5 rounded-full border-2 border-bg
                flex items-center justify-center"
      :class="event.done ? 'bg-primary' : 'bg-border'"
    >
      <Check v-if="event.done" class="w-3 h-3 text-white" />
    </div>
    <p class="text-[14px] font-semibold text-text-primary">{{ event.label }}</p>
    <p class="text-[12px] text-text-tertiary mt-0.5">{{ event.date }}</p>
    <p v-if="event.note" class="text-[12px] text-warning font-medium mt-0.5">{{ event.note }}</p>
  </div>
</div>
```

---

### Actions rapides (détail candidature)

```html
<div class="flex items-center justify-around py-4 border-b border-border">
  <button
    v-for="action in actions"
    :key="action.label"
    class="flex flex-col items-center gap-1.5 active:opacity-70 transition-opacity"
    @click="action.handler"
  >
    <div
      class="w-11 h-11 rounded-full bg-surface border border-border
                flex items-center justify-center shadow-sm"
    >
      <component :is="action.icon" class="w-5 h-5 text-text-secondary" />
    </div>
    <span class="text-[11px] text-text-secondary font-medium">{{ action.label }}</span>
  </button>
</div>
```

Actions : Relancer · Modifier · Notes · Plus

---

### Filtres liste (scroll horizontal)

```html
<div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide px-4">
  <button
    v-for="filter in filters"
    :key="filter.value"
    class="flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition-all"
    :class="active === filter.value
      ? 'bg-primary text-white'
      : 'bg-surface border border-border text-text-secondary'"
    @click="active = filter.value"
  >
    {{ filter.label }}
    <span v-if="filter.count !== undefined" class="ml-1 opacity-70">{{ filter.count }}</span>
  </button>
</div>
```

---

### Stat Cards dashboard (grille 2×2)

```html
<div class="grid grid-cols-2 gap-3 px-4">
  <div class="bg-surface rounded-[14px] p-4 shadow-card">
    <div class="flex items-start justify-between mb-3">
      <p class="text-[13px] text-text-secondary font-medium">{{ label }}</p>
      <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="iconBg">
        <component :is="icon" class="w-4 h-4" :class="iconColor" />
      </div>
    </div>
    <p class="text-2xl font-bold text-text-primary">{{ value }}</p>
    <p class="text-[11px] font-medium mt-1" :class="deltaColor">{{ delta }}</p>
  </div>
</div>
```

---

### Progress bar objectif

```html
<div class="bg-surface rounded-[14px] p-4 shadow-card">
  <div class="flex items-center justify-between mb-1">
    <p class="text-[15px] font-semibold text-text-primary">Ton objectif hebdo</p>
  </div>
  <p class="text-[13px] text-text-secondary mb-3">{{ current }} / {{ target }} candidatures</p>
  <div class="h-2 bg-border rounded-full overflow-hidden">
    <div
      class="h-full bg-primary rounded-full transition-all duration-500"
      :style="{ width: percent + '%' }"
    />
  </div>
  <p class="text-[11px] text-text-tertiary mt-2">{{ motivationText }}</p>
</div>
```

---

### Stats — graphique vue d'ensemble

Fond primary orange (inverse du reste de l'app — contraste fort).

```html
<div class="bg-primary rounded-[14px] p-4 mx-4">
  <p class="text-white font-semibold mb-4">Vue d'ensemble</p>
  <!-- Composant graphique : BarChart de recharts ou chart.js -->
  <!-- Barres blanches semi-transparentes sur fond orange -->
  <div class="flex justify-around mt-4 pt-4 border-t border-white/20">
    <div v-for="stat in stats" :key="stat.label" class="text-center">
      <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
      <p class="text-[11px] text-white/70 mt-0.5">{{ stat.label }}</p>
    </div>
  </div>
</div>
```

---

## Icônes

Librairie : **Lucide Icons** (`lucide-vue-next`)
Style : outline · Taille standard : `w-5 h-5` · Stroke : 1.5–2px

Icônes utilisées : `Send` · `Bell` · `Calendar` · `BarChart2` · `Home` · `Plus` · `ArrowLeft` · `Share2` · `MoreVertical` · `Check` · `CheckCircle` · `X` · `Upload` · `FileText` · `Search` · `Filter` · `Pencil` · `StickyNote` · `Trophy` · `TrendingUp` · `Ban`

---

## Règles de composition

1. **Fond général** : `bg-bg` (`#FFF8F4`) — jamais `bg-white` directement sur une page
2. **Cartes** : `bg-surface rounded-[14px] shadow-card` — jamais de border sur les cartes
3. **Espacement page** : `px-4` horizontal systématique
4. **Bouton CTA** : toujours `w-full rounded-xl py-4 bg-primary text-white font-bold shadow-orange` en bas de chaque étape
5. **Safe area bottom** : `pb-[calc(64px+env(safe-area-inset-bottom))]` sur toute page avec bottom nav
6. **Touch targets** : minimum `44×44px` sur tout élément interactif
7. **États actifs** : toujours définir `active:scale-95` ou `active:opacity-70` — pas seulement `hover:`
8. **Dark mode** : tokens CSS variables uniquement — jamais de couleur hardcodée

---

## Tokens Tailwind — `tailwind.config.ts`

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#F97316',
        dark:    '#EA6C0A',
        light:   '#FFF0E6',
      },
      bg:      '#F9FAFB',
      surface: '#FFFFFF',
      'surface-raised': '#F3F4F6',
      border:  '#E5E7EB',
      text: {
        primary:   '#111827',
        secondary: '#6B7280',
        tertiary:  '#9CA3AF',
      },
      success: { DEFAULT: '#22C55E', light: '#DCFCE7' },
      warning: { DEFAULT: '#F59E0B', light: '#FEF3C7' },
      danger:  { DEFAULT: '#EF4444', light: '#FEE2E2' },
      info:    { DEFAULT: '#6366F1', light: '#EEF2FF' },
    },
    boxShadow: {
      card:   '0 2px 8px rgba(0,0,0,0.06)',
      orange: '0 4px 16px rgba(249,115,22,0.25)',
    },
    borderRadius: {
      input: '10px',
      card:  '14px',
      modal: '20px',
    },
  },
},
```
