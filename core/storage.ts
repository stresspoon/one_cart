import { CartState } from './types';

const KEY = 'cart:state';

// Fallback for non-browser environments (e.g., tests without DOM)
const memoryStore: Record<string, string | undefined> = {};
function hasLocalStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

export function load(key: string): unknown | undefined {
  const raw = hasLocalStorage() ? window.localStorage.getItem(key) : memoryStore[key];
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function save(key: string, value: unknown): void {
  const raw = JSON.stringify(value);
  if (hasLocalStorage()) {
    window.localStorage.setItem(key, raw);
  } else {
    memoryStore[key] = raw;
  }
}

export function seedCart(): CartState {
  const now = Date.now();
  const state: CartState = {
    items: [
      { id: 'it-001', title: '미니 정리함', price: 12000, qty: 1, selected: true },
      { id: 'it-002', title: '무선 마우스', price: 18000, qty: 1, selected: true },
      { id: 'it-003', title: '노트 세트', price: 9000, qty: 1, selected: false },
    ],
    updatedAt: now,
  };
  return state;
}

export function ensureSeed(): CartState {
  const current = load(KEY);
  if (typeof current === 'object' && current && 'items' in (current as any)) {
    return (current as CartState);
  }
  const seeded = seedCart();
  save(KEY, seeded);
  return seeded;
}

export function loadState(): CartState | undefined {
  const data = load(KEY);
  if (!data) return undefined;
  try {
    const obj = data as CartState;
    if (!obj || !Array.isArray(obj.items)) throw new Error('bad');
    return obj;
  } catch {
    const seeded = seedCart();
    save(KEY, seeded);
    return seeded;
  }
}

export function saveState(state: CartState): void {
  save(KEY, state);
}

