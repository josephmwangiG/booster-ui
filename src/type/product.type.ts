export type ProductForm = {
  id: string | null;
  name: string;
  description: string;
  short_description: string;
  thumbnail?: string;
  SKU: string;
  price: number;
  returnable: boolean;
  refundable: boolean;
  tags: string
  category_ids: string[]
  brand_ids: string[]
};