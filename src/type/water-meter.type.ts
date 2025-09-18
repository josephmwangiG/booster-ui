export type WaterMeterForm = {
  id: string | null;
  name: string;
  code_number: string;
  serial_number: string;
  category: string;
  read_frequency: string;
  is_master: boolean;
};



export type MeterReadingForm = {
  id: string | null;
  water_meter_id: string;
  water_client_id: string;
  previous_meter_reading: number;
  current_meter_reading: number;
  consumption: string;
};
