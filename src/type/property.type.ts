export type PropertyForm = {
  id: string | null;
  name: string;
  type: string;
  description: string;
  address: string;
  units: string[]
};

export type UnitForm = {
  id: string | null;
  unit_code: string;
  bathrooms: number;
  bedrooms: number;
  tenant_id: string;
  rent: number;
};