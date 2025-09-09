export type Product = {
  id: string;
  sku: string;
  title: string;
  unitPrice: number; // KRW integer
  imageUrl: string;
  description?: string;
  unit?: string; // e.g., unit of sale
};

export type CartItem = {
  productId: string;
  quantity: number; // >= 1
  selected: boolean;
};

export type CartState = {
  products: Product[];
  items: CartItem[];
};

export type UIState = {
  selectAll: boolean;
};

export type CombinedState = {
  cart: CartState;
  ui: UIState;
};

export const SHIPPING_THRESHOLD = 50_000;
export const SHIPPING_FEE = 3_000;

export type CartAction =
  | { type: 'INIT'; payload: CombinedState }
  | { type: 'TOGGLE_ITEM'; payload: { productId: string } }
  | { type: 'TOGGLE_ALL'; payload: { flag: boolean } }
  | { type: 'CHANGE_QTY'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'REMOVE_SELECTED' };

