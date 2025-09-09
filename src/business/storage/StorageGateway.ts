import { CartItem, Product, UIState } from '../cart/CartTypes';
import { seedCartState, seedUIState } from './SeedData';

const KEY_PRODUCTS = 'cart:v1:products';
const KEY_ITEMS = 'cart:v1:items';
const KEY_UI = 'cart:v1:ui';

type KV = Record<string, string>;

// Allow tests to swap storage backend
let storageRef: Storage | KV | undefined =
  typeof window !== 'undefined' && window.localStorage ? window.localStorage : undefined;

export function setStorageBackend(backend: Storage | KV | undefined) {
  storageRef = backend;
}

function getStorage(): Storage | KV | undefined {
  return storageRef;
}

function readJSON<T>(key: string): T | undefined {
  const s = getStorage();
  if (!s) return undefined;
  try {
    const raw = (s as any).getItem ? (s as Storage).getItem(key) : (s as KV)[key];
    if (!raw) return undefined;
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

function writeJSON<T>(key: string, value: T): void {
  const s = getStorage();
  if (!s) return;
  const raw = JSON.stringify(value);
  if ((s as any).setItem) (s as Storage).setItem(key, raw);
  else (s as KV)[key] = raw;
}

function isProductArray(arr: any): arr is Product[] {
  return Array.isArray(arr) && arr.every((p) => p && typeof p.id === 'string' && typeof p.unitPrice === 'number');
}

function isItemArray(arr: any): arr is CartItem[] {
  return (
    Array.isArray(arr) &&
    arr.every((i) => i && typeof i.productId === 'string' && typeof i.quantity === 'number' && typeof i.selected === 'boolean')
  );
}

function isUI(obj: any): obj is UIState {
  return obj && typeof obj.selectAll === 'boolean';
}

export const StorageGateway = {
  loadProducts(): Product[] | undefined {
    const v = readJSON<Product[]>(KEY_PRODUCTS);
    if (!isProductArray(v)) return undefined;
    return v;
  },
  loadItems(): CartItem[] | undefined {
    const v = readJSON<CartItem[]>(KEY_ITEMS);
    if (!isItemArray(v)) return undefined;
    return v;
  },
  loadUI(): UIState | undefined {
    const v = readJSON<UIState>(KEY_UI);
    if (!isUI(v)) return undefined;
    return v;
  },

  saveProducts(p: Product[]): void {
    writeJSON(KEY_PRODUCTS, p);
  },
  saveItems(i: CartItem[]): void {
    writeJSON(KEY_ITEMS, i);
  },
  saveUI(u: UIState): void {
    writeJSON(KEY_UI, u);
  },

  ensureSeeded(): { products: Product[]; items: CartItem[]; ui: UIState } {
    let products = this.loadProducts();
    let items = this.loadItems();
    let ui = this.loadUI();

    if (!products || !items) {
      const seeded = seedCartState();
      products = seeded.products;
      items = seeded.items;
      this.saveProducts(products);
      this.saveItems(items);
    }

    if (!ui) {
      ui = seedUIState();
      this.saveUI(ui);
    }

    return {
      products: products!,
      items: items!,
      ui: ui!,
    };
  },
};

export type { Product, CartItem, UIState };

