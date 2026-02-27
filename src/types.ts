export interface Service {
  type: 'lettino' | 'sdraio' | 'sedia_regista';
  quantity: number;
}

export interface Booking {
  id?: number;
  row_number: number;
  umbrella_number: number;
  start_date: string;
  end_date: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  total_price: number;
  is_paid: boolean;
  services: Service[];
}

export interface Umbrella {
  row: number;
  number: number;
  isBooked: boolean;
  booking?: Booking;
}
