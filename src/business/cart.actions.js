import { getItems, setItems } from "./cart.store.js";
import { sumSelected, shippingFee, grandTotal } from "./cart.calc.js";

function normalizeQty(qty) {
  const n = parseInt(qty, 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export function toggleSelect(id) {
  const items = getItems();
  const next = items.map((it) => (it.id === id ? { ...it, selected: !it.selected } : it));
  setItems(next);
}

export function toggleSelectAll(flag) {
  const items = getItems();
  const next = items.map((it) => ({ ...it, selected: Boolean(flag) }));
  setItems(next);
}

export function updateQty(id, qty) {
  const items = getItems();
  const q = normalizeQty(qty);
  const next = items.map((it) => (it.id === id ? { ...it, qty: q } : it));
  setItems(next);
}

export function incrementQty(id) {
  const items = getItems();
  const next = items.map((it) => (it.id === id ? { ...it, qty: normalizeQty(it.qty + 1) } : it));
  setItems(next);
}

export function decrementQty(id) {
  const items = getItems();
  const next = items.map((it) => (it.id === id ? { ...it, qty: Math.max(1, normalizeQty(it.qty - 1)) } : it));
  setItems(next);
}

export function removeItem(id) {
  const items = getItems();
  const next = items.filter((it) => it.id !== id);
  setItems(next);
}

export function getSnapshot() {
  const items = getItems();
  const sum = sumSelected(items);
  const shipping = shippingFee(sum);
  const total = grandTotal(sum);
  const allSelected = items.length > 0 && items.every((i) => i.selected);
  const anySelected = items.some((i) => i.selected);
  return { items, sum, shipping, total, allSelected, anySelected };
}

