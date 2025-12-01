# Prompt Template - SearchBar Style Airbnb

## Prompt à copier/coller

```
Crée-moi une searchbar style Airbnb avec les caractéristiques suivantes :

### Design
- Barre arrondie (rounded-full) avec ombre (shadow-lg) et bordure dynamique
- Bordure qui change de couleur au focus (primary)
- Input de recherche en langage naturel avec placeholder descriptif
- Badge "IA" animé qui apparaît quand on tape ou au focus
- Bouton filtres avec icône SlidersHorizontal et compteur de filtres actifs
- Bouton recherche avec gradient (from-primary to-primary-600)
- Affichage des filtres actifs sous forme de badges cliquables sous la barre

### Panneau de filtres
- Sheet/Modal qui monte depuis le bas (side="bottom", h-[85vh])
- Header avec titre, bouton reset et bouton fermer
- 2 onglets : [Tab1] et [Tab2]
- Footer sticky avec boutons "Tout effacer" et "Voir les résultats"

### Tab 1 - Filtres hiérarchiques (3 niveaux)
Structure des données :
- Niveau 1 : Catégories principales (ex: Marques, Fabricants, Services)
- Niveau 2 : Sous-catégories (ex: Soins capillaires, Maquillage)
- Niveau 3 : Options finales (ex: Cheveux secs, Cheveux bouclés)

Desktop : Navigation 3 colonnes côte à côte
- Colonne 1 : Liste des catégories (boutons, surlignage au clic)
- Colonne 2 : Sous-catégories de la catégorie sélectionnée
- Colonne 3 : Options de la sous-catégorie sélectionnée (checkboxes)

Mobile : Accordéons imbriqués
- Accordéon principal par catégorie
- Sous-accordéons pour les sous-catégories avec enfants
- Checkboxes pour les options finales

### Tab 2 - Filtres simples (grille)
- Grille de cartes cliquables (2 cols mobile, 3-4 cols desktop)
- Chaque carte : icône/initiales + label + état actif/inactif
- Style : bordure qui change, background, checkmark quand actif

### State management
- query: string (texte de recherche)
- filters: { categories: Record<string, string[]>, [tab2Key]: string[] }
- Fonctions toggle pour ajouter/retirer des filtres

### Responsive
- Mobile : bouton recherche sans texte, filtres en accordéon
- Desktop : bouton recherche avec texte, filtres en 3 colonnes

### Stack technique
- React + TypeScript
- shadcn/ui : Sheet, Tabs, Accordion, Badge, Button, Checkbox, ScrollArea
- Tailwind CSS
- Lucide icons : Search, SlidersHorizontal, X, ChevronRight, Check, RotateCcw, Sparkles
- next-intl pour les traductions (ou autre système i18n)

### Données fake à inclure
[Décrire ici tes catégories et options spécifiques]
```

---

## Architecture des fichiers

```
components/search/
├── index.ts              # Exports
├── types.ts              # Types + données fake
├── search-bar.tsx        # Composant principal
└── search-filters-sheet.tsx  # Panneau de filtres
```

---

## Structure des types

```typescript
// types.ts
export interface FilterState {
  categories: Record<string, string[]>;  // categoryId -> [selectedOptionIds]
  [secondTabKey]: string[];              // ex: certifications, tags, etc.
}

export interface CategoryData {
  id: string;
  subcategories: SubcategoryData[];
}

export interface SubcategoryData {
  id: string;
  children?: string[];  // Si undefined, la sous-cat est directement sélectionnable
}

export const CATEGORIES_DATA: CategoryData[] = [
  {
    id: "categoryId",
    subcategories: [
      { id: "subId1", children: ["child1", "child2"] },
      { id: "subId2" },  // Pas d'enfants = directement sélectionnable
    ],
  },
];

export const SECOND_TAB_DATA = ["option1", "option2", ...] as const;
```

---

## Traductions nécessaires

```json
{
  "search": {
    "placeholder": "Recherchez...",
    "search": "Rechercher",
    "filters": "Filtres",
    "clear": "Effacer",
    "clearAll": "Tout effacer",
    "filtersTitle": "Affiner votre recherche",
    "reset": "Réinitialiser",
    "activeFilters": "{count} filtres actifs",
    "showResults": "Voir les résultats",
    "selectCategory": "Sélectionnez une catégorie",
    "selectSubcategory": "Sélectionnez une sous-catégorie",
    "tabs": {
      "tab1": "Catégories",
      "tab2": "Certifications"
    },
    "categories": {
      "[categoryId]": {
        "label": "Nom affiché",
        "subcategories": {
          "[subId]": "Nom sous-cat"
        }
      }
    },
    "children": {
      "[childId]": "Nom option"
    },
    "[secondTabKey]": {
      "[optionId]": "Nom option"
    }
  }
}
```

---

## Composants shadcn requis

```bash
pnpm dlx shadcn@latest add badge scroll-area sheet tabs accordion checkbox button
```

---

## Points clés du design

| Élément | Classes Tailwind |
|---------|------------------|
| Barre principale | `rounded-full border-2 shadow-lg hover:shadow-xl transition-all` |
| Focus state | `border-primary shadow-xl shadow-primary/10` |
| Bouton recherche | `rounded-full bg-gradient-to-r from-primary to-primary-600` |
| Badge filtre actif | `bg-white border shadow-sm` |
| Sheet | `h-[85vh] rounded-t-3xl` |
| Colonne sélectionnée (desktop) | `bg-primary text-white` |
| Checkbox custom | `w-5 h-5 rounded border-2 bg-primary border-primary` quand checked |
| Carte certification | `border-2 rounded-xl hover:shadow-md` |

---

## Exemple de customisation

Pour adapter à un autre domaine (ex: immobilier) :

```typescript
// types.ts
export const CATEGORIES_DATA: CategoryData[] = [
  {
    id: "propertyType",
    subcategories: [
      { id: "house", children: ["villa", "cottage", "mansion"] },
      { id: "apartment", children: ["studio", "loft", "penthouse"] },
    ],
  },
  {
    id: "location",
    subcategories: [
      { id: "paris", children: ["1er", "2eme", "marais"] },
      { id: "lyon" },
    ],
  },
];

export const AMENITIES_DATA = [
  "pool", "garden", "parking", "elevator", "terrace"
] as const;
```
