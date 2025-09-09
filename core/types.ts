export interface CartItem {
  id: string;
  title: string;
  price: number;
  qty: number;
  selected: boolean;
  image?: string;
}

export interface CartState {
  items: CartItem[];
  updatedAt: number;
}

export interface Totals {
  subtotal: number;
  shipping: number;
  grandTotal: number;
  selectedCount: number;
}

export const SHIPPING_THRESHOLD = 50000;
export const SHIPPING_FEE = 3000;

