export type WaterDeliveryForm = {
  create_client: boolean | false;
  id: string | null;
  water_client_id: string;
  organization_id: number;
  driver_id: number;
  vehicle_id: number;
  departure_time: string; 
  return_time?: string | null; 
  quantity_liters: number;
  total_amount: number;
  amount_paid?: number | null; 
  client_name: string;
  address: string;
  phone: string;
  email?: string | null; 
  record_payment?: boolean;
  water_delivery_id?: number; 
  payment_date?: string | null; 
  payment_method?: string | null; 
  payment_code?: string | null; 
  payment_reference?: string | null; 
  notes?: string | null;
};

export type WaterDeliveryPaymentForm = {
  id: string | null;
  water_delivery_id: string | null;
  amount: number;
  payment_date: string;
  payment_reference: string;
  payment_method: number;
};


export type PendingMoneyCollectionForm = {
  id: string | null;
  water_meter_id: string | null;
  amount: number;
  phone_number: string;
  client_name: string;
};
export type CollectionPaymentForm = {
  id: string | null;
  payment_method: string | null;
  payment_date: string | null;
  amount: number;
  phone_number: string;
  client_name: string;
  water_meter_id: string | null;
  status?: string;
};

export type MoneyCollectionForm = {
  id?: string;
  water_meter_id?: string;
  collection_date?: string;
  amount?: number;
  payment_method?: string;
  driver_id?: string;
  vehicle_id?: string;
};

