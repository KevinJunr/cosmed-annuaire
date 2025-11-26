import type { Sector } from "@/types";

export const SECTORS: Sector[] = [
  { id: "sect-1", code: "BRAND", nameKey: "sectors.brand" },
  { id: "sect-2", code: "FORMULATION_SUBCONTRACTOR", nameKey: "sectors.formulationSubcontractor" },
  { id: "sect-3", code: "MANUFACTURING_SUBCONTRACTOR", nameKey: "sectors.manufacturingSubcontractor" },
  { id: "sect-4", code: "PACKAGING_SUBCONTRACTOR", nameKey: "sectors.packagingSubcontractor" },
  { id: "sect-5", code: "INGREDIENT_SUPPLIER", nameKey: "sectors.ingredientSupplier" },
  { id: "sect-6", code: "SOAP_MAKER", nameKey: "sectors.soapMaker" },
  { id: "sect-7", code: "CONSULTANT", nameKey: "sectors.consultant" },
  { id: "sect-8", code: "LABORATORY", nameKey: "sectors.laboratory" },
  { id: "sect-9", code: "TRAINING_ORGANIZATION", nameKey: "sectors.trainingOrganization" },
];

export function getSectorById(id: string): Sector | undefined {
  return SECTORS.find((s) => s.id === id);
}

export function getSectorByCode(code: string): Sector | undefined {
  return SECTORS.find((s) => s.code === code);
}
