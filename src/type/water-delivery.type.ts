export type WaterDeliveryForm = {
  id: string | null;
  organization_id: number;
  driver_id: number;
  vehicle_id: number;
  departure_time: string; 
  return_time?: string | null; 
  capacity: number;
  amount: number;
  amount_paid?: number | null; 
  client_name: string;
  address: string;
  phone_number: string;
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
};

