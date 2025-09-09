export type CartItem = {
  id: string;
  title: string;
  price: number; // KRW, integer
  qty: number; // >= 1
  selected: boolean;
  image?: string;
};

export type CartState = {
  items: CartItem[];
  updatedAt: number; // epoch ms
};

export type Totals = {
  subtotal: number;
  shipping: number;
  grandTotal: number;
  selectedCount: number;
};

export const SHIPPING_THRESHOLD = 50000; // KRW
export const SHIPPING_FEE = 3000; // KRW

