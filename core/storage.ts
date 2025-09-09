import { CartItem, CartState } from './types.ts';

const KEY = 'cart:state';

// Local fallback for non-browser environments (tests)
const memoryStore = new Map<string, string>();

function getLocalStorage(): Storage | undefined {
  try {
    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis && globalThis.localStorage) {
      return globalThis.localStorage as Storage;
    }
  } catch (_) {
    // ignore access errors (privacy mode, etc.)
  }
  return undefined;
}

export function load<T = unknown>(key: string): T | undefined {
  const ls = getLocalStorage();
  try {
    const raw = ls ? ls.getItem(key) : memoryStore.get(key);
    if (!raw) return undefined;
    return JSON.parse(raw) as T;
  } catch (_) {
    return undefined;
  }
}

export function save(key: string, value: unknown): void {
  const ls = getLocalStorage();
  const raw = JSON.stringify(value);
  try {
    if (ls) ls.setItem(key, raw); else memoryStore.set(key, raw);
  } catch (_) {
    // ignore quota or serialization errors
  }
}

export function seedCart(): CartState {
  const items: CartItem[] = [
    { id: 'it-001', title: '미니 정리함', price: 12000, qty: 1, selected: true, image: '' },
    { id: 'it-002', title: '무선 마우스', price: 18000, qty: 1, selected: true, image: '' },
    { id: 'it-003', title: '노트 세트',  price:  9000, qty: 1, selected: false, image: '' },
  ];
  const state: CartState = { items, updatedAt: Date.now() };
  return state;
}

export function ensureSeed(): CartState {
  const current = load<CartState>(KEY);
  if (!current) {
    const seeded = seedCart();
    save(KEY, seeded);
    return seeded;
  }

  // Guard: malformed numbers or negatives → coerce
  const fixed: CartState = {
    items: (current.items || []).map((it) => ({
      id: String(it.id),
      title: String(it.title ?? ''),
      price: Number.isFinite(it.price) ? Math.max(0, Math.trunc(it.price)) : 0,
      qty: Number.isFinite(it.qty) ? Math.max(1, Math.trunc(it.qty)) : 1,
      selected: Boolean(it.selected),
      image: it.image ?? ''
    })),
    updatedAt: Date.now(),
  };

  save(KEY, fixed);
  return fixed;
}

export function getKey(): string { return KEY; }

