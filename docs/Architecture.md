# Architecture du projet Cosmed Annuaire

Ce document décrit l'architecture technique du projet, la structure des dossiers et les conventions à suivre.

---

## Vue d'ensemble

Le projet utilise une architecture **monorepo** avec Turborepo et pnpm. L'application principale est une app Next.js 15 avec App Router.

```
cosmed-annuaire/
├── apps/
│   └── web/                    # Application Next.js principale
├── packages/
│   ├── ui/                     # Composants UI partagés (shadcn/ui)
│   ├── eslint-config/          # Configuration ESLint partagée
│   └── typescript-config/      # Configuration TypeScript partagée
└── docs/                       # Documentation projet
```

---

## Structure de `apps/web/`

### `app/` - App Router (Next.js 15)

Structure basée sur le routing de Next.js avec groupes de routes.

```
app/
├── auth/
│   └── callback/               # Callback Supabase (confirmation email)
│       └── route.ts
├── [locale]/                   # Routes internationalisées (fr, en, es, zh, ar)
│   ├── (auth)/                 # Routes NON authentifiées
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (onboarding)/           # Routes authentifiées SANS onboarding complété
│   │   └── onboarding/
│   ├── (protected)/            # Routes authentifiées AVEC onboarding complété
│   │   ├── home/
│   │   ├── annuaire/           # Recherche et annuaire (auth requis)
│   │   └── entreprise/
│   └── (public)/               # Routes sans auth (landing, légal)
└── layout.tsx                  # Layout racine
```

**Groupes de routes :**

| Groupe | Accès | Description |
|--------|-------|-------------|
| `(auth)` | Non authentifié uniquement | Login, register, mot de passe oublié |
| `(onboarding)` | Authentifié, onboarding non complété | Wizard d'onboarding |
| `(protected)` | Authentifié, onboarding complété | Dashboard, annuaire, recherche, entreprise |
| `(public)` | Tout le monde (auth ou non) | Landing page, CGU, CGV, mentions légales, contact |

---

### `components/` - Composants métier

Composants spécifiques à l'application (pas réutilisables dans d'autres projets).

```
components/
├── onboarding/
│   ├── onboarding-wizard.tsx       # Orchestrateur du wizard
│   ├── onboarding-navbar.tsx       # Navbar spécifique onboarding
│   ├── step-container.tsx          # Container pour les steps
│   ├── step-indicator.tsx          # Indicateur de progression
│   └── steps/
│       ├── step-purpose.tsx        # Étape 1 : Objectif
│       ├── step-personal-info.tsx  # Étape 2 : Infos personnelles
│       ├── step-company-select.tsx # Étape 3a : Sélection entreprise
│       └── step-company-create.tsx # Étape 3b : Création entreprise
├── ui/
│   ├── password-input.tsx          # Input mot de passe avec toggle
│   └── password-rules.tsx          # Affichage règles mot de passe
├── navbar.tsx                      # Navbar principale
├── login-form.tsx
├── register-form.tsx
└── ...
```

**Convention :** Si un composant est utilisé uniquement dans cette app → `components/`

---

### `lib/` - Utilitaires et logique

```
lib/
├── supabase/
│   ├── client.ts           # Client Supabase pour composants client
│   ├── server.ts           # Client Supabase pour Server Components/Actions
│   └── middleware.ts       # Gestion session dans middleware
├── repositories/           # Couche d'accès aux données (DAL)
│   ├── base.ts             # Types Result, helpers erreurs
│   ├── users.ts            # CRUD utilisateurs
│   ├── companies.ts        # CRUD entreprises
│   └── index.ts
├── services/               # Logique métier complexe
│   ├── onboarding.ts       # Service onboarding (orchestre repositories)
│   └── index.ts
├── constants/              # Données statiques (secteurs, pays, départements)
│   ├── sectors.ts
│   ├── countries.ts
│   └── departments.ts
└── validations/            # Schémas Zod et fonctions de validation
    ├── index.ts
    └── onboarding.ts
```

#### Pattern Repository

Les **repositories** encapsulent toutes les requêtes Supabase. On n'appelle jamais `supabase.from('table')` directement dans les composants.

```typescript
// Au lieu de ça (mauvais)
const { data } = await supabase.from('users').select('*').eq('id', id);

// On fait ça (bien)
import { usersRepository } from '@/lib/repositories';
const result = await usersRepository.getUserById(id);
```

**Avantages :**
- Requêtes centralisées
- Gestion d'erreurs uniforme avec `RepositoryResult<T>`
- Facile à tester/mocker
- Changement de DB = modifications dans un seul endroit

#### Pattern Service

Les **services** contiennent la logique métier qui orchestre plusieurs repositories.

```typescript
// Service onboarding : orchestre users + companies
import { onboardingService } from '@/lib/services';
const result = await onboardingService.completeOnboarding(userId, data);
```

---

### `providers/` - Context Providers React

```
providers/
├── index.tsx               # Composition de tous les providers
├── auth-provider.tsx       # Context auth (user, session)
└── onboarding-provider.tsx # Context état onboarding (steps, data)
```

---

### `types/` - Types TypeScript

```
types/
├── index.ts                # Re-export de tous les types
├── database.ts             # Types générés par Supabase CLI
├── onboarding.ts           # Types spécifiques onboarding
├── auth.ts                 # Types auth
└── constants.ts            # Types pour les constantes (Sector, Department...)
```

**Types Database :**

```typescript
// Types auto-générés (à regénérer après modif DB)
// npx supabase gen types typescript --project-id XXX > types/database.ts

import type { User, Company, UserInsert } from '@/types';
```

---

### `hooks/` - Custom Hooks

```
hooks/
└── use-*.ts                # Hooks custom spécifiques à l'app
```

---

### `i18n/` - Internationalisation

```
i18n/
├── config.ts               # Configuration locales, RTL
├── routing.ts              # Configuration next-intl routing
└── navigation.ts           # Link, useRouter localisés
```

---

### `messages/` - Traductions

```
messages/
├── fr.json                 # Français (défaut)
├── en.json                 # Anglais
├── es.json                 # Espagnol
├── zh.json                 # Chinois
└── ar.json                 # Arabe (RTL)
```

**Convention :** Toujours ajouter les traductions dans les 5 fichiers lors d'ajout de texte.

---

## Structure de `packages/ui/`

Composants UI réutilisables basés sur shadcn/ui.

```
packages/ui/
├── src/
│   ├── components/         # Composants shadcn/ui
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   └── ...
│   ├── hooks/              # Hooks partagés
│   ├── lib/
│   │   └── utils.ts        # Fonction cn() pour classes
│   └── styles/
│       └── globals.css     # Styles globaux + variables CSS
└── components.json         # Config shadcn/ui
```

**Ajouter un composant shadcn/ui :**

```bash
cd apps/web
pnpm dlx shadcn@latest add button
# Le composant s'installe automatiquement dans packages/ui/src/components/
```

**Importer un composant :**

```typescript
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
```

---

## Flux d'authentification

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Register  │────▶│  Validation │────▶│  Onboarding │────▶│    Home     │
│  (email/    │     │ (email link │     │  (3 steps)  │     │ (dashboard) │
│   phone)    │     │  ou OTP)    │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

**Middleware (`middleware.ts`) :**
- User non auth → routes `(auth)` autorisées, `(protected)` redirige vers `/login`
- User auth → routes `(auth)` redirigent vers `/home`, `/` redirige vers `/home`
- `/home` vérifie `localStorage` → si onboarding non complété → redirige vers `/onboarding`

---

## Conventions de code

### Imports

```typescript
// 1. Packages externes
import { useState } from "react";
import { useTranslations } from "next-intl";

// 2. Packages internes (@workspace)
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

// 3. Alias locaux (@/)
import { useAuth } from "@/providers/auth-provider";
import type { User } from "@/types";
```

### Nommage fichiers

| Type | Convention | Exemple |
|------|------------|---------|
| Composants | kebab-case | `user-menu.tsx` |
| Hooks | kebab-case avec `use-` | `use-auth.ts` |
| Types | kebab-case | `onboarding.ts` |
| Utils | kebab-case | `validations.ts` |

### Composants

```typescript
// Toujours exporter nommé (pas default)
export function MyComponent() { ... }

// Props avec interface
interface MyComponentProps {
  title: string;
  onClick?: () => void;
}
```

---

## Commandes utiles

```bash
# Développement
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Type check
cd apps/web && npx tsc --noEmit

# Ajouter composant shadcn
cd apps/web && pnpm dlx shadcn@latest add [component]

# Générer types Supabase
npx supabase gen types typescript --project-id XXX > apps/web/types/database.ts
```

---

## Diagramme des couches

```
┌─────────────────────────────────────────────────────────────┐
│                        PRÉSENTATION                         │
│  (app/, components/, providers/)                            │
│  - Pages, composants React, contexts                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         SERVICES                            │
│  (lib/services/)                                            │
│  - Logique métier, orchestration                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       REPOSITORIES                          │
│  (lib/repositories/)                                        │
│  - Accès données, requêtes Supabase                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        SUPABASE                             │
│  (lib/supabase/)                                            │
│  - Clients Supabase (browser, server)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BASE DE DONNÉES                          │
│  PostgreSQL (Supabase)                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Ressources

- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)
- [next-intl](https://next-intl-docs.vercel.app)
