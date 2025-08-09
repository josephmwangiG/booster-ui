export type PaymentForm = {
  invoice_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  payment_code: string;
  payment_reference?: string;
  notes?: string;
};
