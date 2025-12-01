// Filter state types
export interface FilterState {
  categories: Record<string, string[]>;
  certifications: string[];
}

// Category with hierarchical subcategories
export interface CategoryData {
  id: string;
  subcategories: SubcategoryData[];
}

export interface SubcategoryData {
  id: string;
  children?: string[];
}

// Fake data for categories (hierarchical structure)
export const CATEGORIES_DATA: CategoryData[] = [
  {
    id: "brands",
    subcategories: [
      {
        id: "haircare",
        children: ["dryHair", "curlyHair", "coloredHair", "oilyHair", "dandruff"],
      },
      {
        id: "skincare",
        children: ["antiAging", "acne", "sensitive", "hydration", "brightening"],
      },
      {
        id: "makeup",
        children: ["face", "eyes", "lips", "nails"],
      },
      {
        id: "fragrance",
        children: ["women", "men", "unisex", "niche"],
      },
      {
        id: "bodycare",
        children: ["moisturizers", "scrubs", "suncare", "deodorants"],
      },
    ],
  },
  {
    id: "manufacturers",
    subcategories: [
      {
        id: "formulation",
        children: ["natural", "organic", "synthetic", "hybrid"],
      },
      {
        id: "packaging",
        children: ["glass", "plastic", "aluminum", "sustainable"],
      },
      {
        id: "filling",
        children: ["liquid", "cream", "powder", "solid"],
      },
    ],
  },
  {
    id: "ingredients",
    subcategories: [
      {
        id: "actives",
        children: ["vitamins", "peptides", "acids", "antioxidants", "retinoids"],
      },
      {
        id: "naturals",
        children: ["plantExtracts", "essentialOils", "butters", "waxes"],
      },
      {
        id: "preservatives",
        children: ["parabens", "parabenfree", "naturalPreservatives"],
      },
    ],
  },
  {
    id: "services",
    subcategories: [
      {
        id: "consulting",
        children: ["regulatory", "marketing", "formulation", "sustainability"],
      },
      {
        id: "testing",
        children: ["stability", "efficacy", "safety", "microbiological"],
      },
      {
        id: "training",
        children: ["cosmetics", "regulations", "quality", "production"],
      },
    ],
  },
];

// Fake data for certifications
export const CERTIFICATIONS_DATA = [
  "iso22716",
  "iso9001",
  "ecocert",
  "cosmos",
  "natrue",
  "bdih",
  "vegan",
  "crueltyFree",
  "halal",
  "fda",
  "gmp",
  "organic",
] as const;

export type CertificationId = typeof CERTIFICATIONS_DATA[number];
