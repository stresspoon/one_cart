import { CartItem, CartState, Totals, SHIPPING_FEE, SHIPPING_THRESHOLD } from './types';

function cloneState(state: CartState): CartState {
  return {
    updatedAt: state.updatedAt,
    items: state.items.map((it) => ({ ...it })),
  };
}

export function coerceState(state: CartState): CartState {
  const next = cloneState(state);
  next.items = next.items.map((it) => ({
    ...it,
    qty: Number.isFinite(it.qty) && it.qty > 0 ? Math.floor(it.qty) : 1,
    price: Number.isFinite(it.price) && it.price >= 0 ? Math.floor(it.price) : 0,
    selected: !!it.selected,
  }));
  return { ...next, updatedAt: Date.now() };
}

export function getTotals(state: CartState): Totals {
  const selected = state.items.filter((it) => it.selected);
  const subtotal = selected.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal < SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
  const grandTotal = subtotal + shipping;
  return {
    subtotal,
    shipping,
    grandTotal,
    selectedCount: selected.length,
  };
}

export function toggleSelect(state: CartState, id: string): CartState {
  const next: CartState = { ...cloneState(state), updatedAt: Date.now() };
  next.items = next.items.map((it) => (it.id === id ? { ...it, selected: !it.selected } : it));
  return next;
}

export function toggleSelectAll(state: CartState, flag: boolean): CartState {
  const next: CartState = { ...cloneState(state), updatedAt: Date.now() };
  next.items = next.items.map((it) => ({ ...it, selected: flag }));
  return next;
}

type QtyOp = number; // can be +1 / -1 delta or absolute >=1

export function updateQty(state: CartState, id: string, op: QtyOp): CartState {
  const next: CartState = { ...cloneState(state), updatedAt: Date.now() };
  next.items = next.items.map((it) => {
    if (it.id !== id) return it;
    let newQty: number;
    if (op === +1 || op === -1) {
      newQty = it.qty + op;
    } else {
      newQty = Math.floor(op);
    }
    if (!Number.isFinite(newQty) || newQty < 1) newQty = 1;
    return { ...it, qty: newQty };
  });
  return next;
}

export function removeItem(state: CartState, id: string): CartState {
  const next: CartState = { ...cloneState(state), updatedAt: Date.now() };
  next.items = next.items.filter((it) => it.id !== id);
  return next;
}

