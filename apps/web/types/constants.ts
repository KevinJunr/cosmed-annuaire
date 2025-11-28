// Types for mock/legacy data (sectors not yet migrated to Supabase)

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
