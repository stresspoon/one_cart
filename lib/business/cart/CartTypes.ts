export type ID = string;

export interface Product {
  id: ID;
  sku: string;
  title: string;
  unitPrice: number; // KRW minor units disabled; raw won
  imageUrl: string;
  description?: string;
  unit?: string;
}

export interface CartItem {
  productId: ID;
  quantity: number;
  selected: boolean;
}

export interface CartState {
  products: Product[];
  items: CartItem[];
}

export interface UIState {
  selectAll: boolean;
}

export interface Totals {
  selectedSum: number;
  shippingFee: number;
  grandTotal: number;
}

export const STORAGE_KEYS = {
  products: 'cart:v1:products',
  items: 'cart:v1:items',
  ui: 'cart:v1:ui',
} as const;

export const SHIPPING_THRESHOLD = 50_000;
export const SHIPPING_FEE = 3_000;

export type CartAction =
  | { type: 'INIT' }
  | { type: 'TOGGLE_ITEM'; productId: ID }
  | { type: 'TOGGLE_ALL'; flag: boolean }
  | { type: 'CHANGE_QTY'; productId: ID; nextQty: number }
  | { type: 'REMOVE_ITEM'; productId: ID }
  | { type: 'REMOVE_SELECTED' };

