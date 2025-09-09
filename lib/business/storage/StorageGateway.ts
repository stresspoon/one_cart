import { CartItem, Product, UIState, STORAGE_KEYS } from '../cart/CartTypes';

type Json = unknown;

// Simple in-memory storage fallback for SSR/tests
const memory = new Map<string, string>();

function getStorage(): Storage | { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void; removeItem: (k: string) => void } {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    return window.localStorage;
  }
  return {
    getItem: (k: string) => memory.get(k) ?? null,
    setItem: (k: string, v: string) => void memory.set(k, v),
    removeItem: (k: string) => void memory.delete(k),
  };
}

function safeParse<T>(raw: string | null): T | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export const StorageGateway = {
  loadProducts(): Product[] | undefined {
    const store = getStorage();
    const data = safeParse<Product[]>(store.getItem(STORAGE_KEYS.products));
    if (!Array.isArray(data)) return undefined;
    return data;
  },
  loadItems(): CartItem[] | undefined {
    const store = getStorage();
    const data = safeParse<CartItem[]>(store.getItem(STORAGE_KEYS.items));
    if (!Array.isArray(data)) return undefined;
    return data;
  },
  loadUI(): UIState | undefined {
    const store = getStorage();
    const data = safeParse<UIState>(store.getItem(STORAGE_KEYS.ui));
    if (!data || typeof (data as any).selectAll !== 'boolean') return undefined;
    return data;
  },
  saveProducts(p: Product[]): void {
    const store = getStorage();
    store.setItem(STORAGE_KEYS.products, JSON.stringify(p as Json));
  },
  saveItems(i: CartItem[]): void {
    const store = getStorage();
    store.setItem(STORAGE_KEYS.items, JSON.stringify(i as Json));
  },
  saveUI(u: UIState): void {
    const store = getStorage();
    store.setItem(STORAGE_KEYS.ui, JSON.stringify(u as Json));
  },
  clearAll(): void {
    const store = getStorage();
    store.removeItem(STORAGE_KEYS.products);
    store.removeItem(STORAGE_KEYS.items);
    store.removeItem(STORAGE_KEYS.ui);
  },
  // test helpers
  __memoryReset(): void {
    memory.clear();
  },
};

