export type WaterClientForm = {
  id: string | null;
  client_name: string;
  meter_number: string;
  email: string;
  phone: string;
  alternative_phone: string;
  address: string;
  id_number: string[]
};

export type TenancyForm = {
  id: string | null;
  property_id: string;
  unit_id: string;
  tenant_id: number;
  start_date: string;
  end_date: string;
  rent_amount: number;
};


export type WaterClientBillForm = {
  id: string | null;
  water_client_id: string;
  previous_meter_reading: number;
  current_meter_reading: number;
  amount: number;
  rate: number;
  from: string;
  to: string;
  due_date: string;
  payment_status: string;
};

export type WaterClientBillPaymentForm = {
  id: string | null;
  water_client_bill_id: string | null;
  amount: number | null;
  payment_date: string;
  payment_ref: string;
  payment_method: string;
};
