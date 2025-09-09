import { CartItem, CartState, Totals, SHIPPING_FEE, SHIPPING_THRESHOLD } from './types.ts';

export function getTotals(state: CartState): Totals {
  const selected = state.items.filter((it) => it.selected);
  const subtotal = selected.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shipping = subtotal === 0 ? 0 : (subtotal < SHIPPING_THRESHOLD ? SHIPPING_FEE : 0);
  const grandTotal = subtotal + shipping;
  return {
    subtotal,
    shipping,
    grandTotal,
    selectedCount: selected.length,
  };
}

export function toggleSelect(state: CartState, id: string): CartState {
  const items = state.items.map((it) => it.id === id ? { ...it, selected: !it.selected } : it);
  return { items, updatedAt: Date.now() };
}

export function toggleSelectAll(state: CartState, flag: boolean): CartState {
  const items = state.items.map((it) => ({ ...it, selected: !!flag }));
  return { items, updatedAt: Date.now() };
}

type QtyOp = number | 'inc' | 'dec';

export function updateQty(state: CartState, id: string, op: QtyOp): CartState {
  const items = state.items.map((it) => {
    if (it.id !== id) return it;
    let next = it.qty;
    if (op === 'inc') next = it.qty + 1;
    else if (op === 'dec') next = it.qty - 1;
    else if (typeof op === 'number') next = Math.trunc(op);
    next = Number.isFinite(next) ? Math.max(1, next) : 1;
    return { ...it, qty: next };
  });
  return { items, updatedAt: Date.now() };
}

export function removeItem(state: CartState, id: string): CartState {
  const items = state.items.filter((it) => it.id !== id);
  return { items, updatedAt: Date.now() };
}

export function coerceState(state: CartState): CartState {
  const items = state.items.map((it) => ({
    ...it,
    price: Number.isFinite(it.price) ? Math.max(0, Math.trunc(it.price)) : 0,
    qty: Number.isFinite(it.qty) ? Math.max(1, Math.trunc(it.qty)) : 1,
    selected: !!it.selected,
  }));
  return { items, updatedAt: Date.now() };
}

