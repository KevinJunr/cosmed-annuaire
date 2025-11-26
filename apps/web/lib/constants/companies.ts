import type { MockCompany } from "@/types";

export const MOCK_COMPANIES: MockCompany[] = [
  {
    id: "comp-1",
    name: "CosmeticLab France",
    sectorId: "sect-2",
    country: "France",
    address: "123 Rue de la Beauté, 75008 Paris",
    isPremium: true,
  },
  {
    id: "comp-2",
    name: "NaturaSkin",
    sectorId: "sect-1",
    country: "France",
    address: "45 Avenue des Cosmétiques, 69001 Lyon",
    isPremium: false,
  },
  {
    id: "comp-3",
    name: "BioIngredients SARL",
    sectorId: "sect-5",
    country: "France",
    address: "8 Rue des Sciences, 33000 Bordeaux",
    isPremium: true,
  },
  {
    id: "comp-4",
    name: "PackCosmetics",
    sectorId: "sect-4",
    country: "France",
    address: "22 Zone Industrielle, 59000 Lille",
    isPremium: false,
  },
  {
    id: "comp-5",
    name: "FormulaCare GmbH",
    sectorId: "sect-2",
    country: "Germany",
    address: "Kosmetikstrasse 15, 80331 Munich",
    isPremium: true,
  },
  {
    id: "comp-6",
    name: "EcoSoap Artisan",
    sectorId: "sect-6",
    country: "France",
    address: "12 Chemin des Savons, 13001 Marseille",
    isPremium: false,
  },
  {
    id: "comp-7",
    name: "CosmeConsult",
    sectorId: "sect-7",
    country: "France",
    address: "5 Place de la Consultation, 75001 Paris",
    isPremium: false,
  },
  {
    id: "comp-8",
    name: "DermaTest Laboratory",
    sectorId: "sect-8",
    country: "France",
    address: "100 Boulevard des Tests, 31000 Toulouse",
    isPremium: true,
  },
  {
    id: "comp-9",
    name: "CosmoTrain Academy",
    sectorId: "sect-9",
    country: "France",
    address: "3 Rue de la Formation, 44000 Nantes",
    isPremium: false,
  },
  {
    id: "comp-10",
    name: "BeautyMakers International",
    sectorId: "sect-3",
    country: "Spain",
    address: "Calle Cosmetica 42, 28001 Madrid",
    isPremium: true,
  },
];

export function searchCompanies(query: string): MockCompany[] {
  const lowercaseQuery = query.toLowerCase();
  return MOCK_COMPANIES.filter(
    (company) =>
      company.name.toLowerCase().includes(lowercaseQuery) ||
      company.country.toLowerCase().includes(lowercaseQuery) ||
      company.address?.toLowerCase().includes(lowercaseQuery)
  );
}

export function getCompanyById(id: string): MockCompany | undefined {
  return MOCK_COMPANIES.find((c) => c.id === id);
}

export function getCompaniesBySector(sectorId: string): MockCompany[] {
  return MOCK_COMPANIES.filter((c) => c.sectorId === sectorId);
}
