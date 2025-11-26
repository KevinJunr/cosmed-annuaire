// Types for reference data (departments, positions, sectors, companies)

export interface Department {
  id: string;
  code: string;
  nameKey: string;
}

export interface Position {
  id: string;
  code: string;
  nameKey: string;
}

export interface Sector {
  id: string;
  code: string;
  nameKey: string;
}

export interface MockCompany {
  id: string;
  name: string;
  sectorId: string;
  country: string;
  address?: string;
  isPremium: boolean;
}

export interface Country {
  code: string;
  nameKey: string;
}
