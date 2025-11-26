import type { Country } from "@/types";

export const COUNTRIES: Country[] = [
  { code: "FR", nameKey: "france" },
  { code: "DE", nameKey: "germany" },
  { code: "ES", nameKey: "spain" },
  { code: "IT", nameKey: "italy" },
  { code: "GB", nameKey: "unitedKingdom" },
  { code: "US", nameKey: "unitedStates" },
  { code: "CN", nameKey: "china" },
  { code: "JP", nameKey: "japan" },
  { code: "KR", nameKey: "southKorea" },
  { code: "OTHER", nameKey: "other" },
];

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
