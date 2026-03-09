export interface Service {
  type: 'lettino' | 'sdraio' | 'sedia_regista';
  quantity: number;
}

export interface Booking {
  id?: number;
  row_number: number;
  umbrella_number: number; // For Riva zones, this can represent the zone ID (e.g., 1 for A, 2 for B, 3 for C) or be 0 if using a new field
  zone_id?: string; // e.g. 'A', 'B', 'C'
  quantity?: number; // How many lettini requested in that zone
  start_date: string;
  end_date: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  total_price: number;
  is_paid: boolean;
  payment_method?: 'online' | 'cassa';
  checked_in?: boolean;
  is_subscription?: boolean;
  services: Service[];
}

export interface Umbrella {
  row: number; // 0 for Riva
  number: number;
  isBooked: boolean;
  booking?: Booking;
  isSubscription?: boolean;
  // New properties for Riva Zones
  isZone?: boolean;
  zoneId?: string;
  zoneName?: string;
  maxCapacity?: number;
  availableQuantity?: number;
  selectedQuantity?: number;
}
