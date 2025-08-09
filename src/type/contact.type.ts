export type ContactForm = {
  id: string;
  contact_type: string;
  contact_category: string;
  contact_group_id: number;
  business_name?: string;
  prefix?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  alternative_phone_number?: string;
  email: string;
  alternative_email?: string;
  assigned_to: number;
  tax_number?: string;
  payment_term?: number;
  credit_limit?: number;
  address_line_1: string;
  address_line_2?: string;
  billing_address?: string;
  shipping_address?: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
};

export type GroupForm = {
  id: string;
  name: string;
  description: string;
  assigned_to: string;
  credit_limit: string;
  payment_term: string;
};
