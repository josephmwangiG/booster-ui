export type TenantForm = {
  id: string | null;
  tenant_name: string;
  email: string;
  phone: string;
  emergency_phone: string;
  unit_id: string;
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


export type TenantBillItemForm = {
  id: string | null;
  previous_meter_reading: number;
  current_meter_reading: number;
  amount: number;
  rate: number;
  utility: any;
};

export type TenantBillPaymentForm = {
  id: string | null;
  tenant_bill_id: string | null;
  amount: number;
  payment_date: string;
  payment_ref: string;
  payment_method: number;
};
