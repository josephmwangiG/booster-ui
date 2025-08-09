export type InventoryForm = {
  id: string;
  product_id: string;
  store_id: string;
  source: number;
  unit_type: string;
  quantity: string;
  purchase_price?: number;
  VAT?: number;
  discount: number;
  discount_type?: string;
  is_published?: boolean;
  base_price: number;
  selling_price: number;
  offer?: number;
  available_for_wholesale?: boolean;
  min_wholesale_quantity?: number;
  wholesale_price?: number;
  wholesale_info?: string;
}


export type InventoryAdjustmentForm = {
  inventory_id: number;
  reason?: string;
  mode_of_adjustment?: string;
  description?: string;
  quantity_on_hand: number;
  quantity_available: number;
  quantity_adjustment: number;
  date_of_adjustment: string;
};

export type InventoryMovementForm = {
  id: string;
  inventory_id: string;
  source_store_id?: string;
  store_id: string;
  description: number;
  quantity: number;
  quantity_available: number;
  purchase_price?: number;
  VAT?: number;
  discount: number;
  discount_type?: string;
  base_price: number;
  selling_price: number;
}
