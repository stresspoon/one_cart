import { store } from './cart.store.js';
import { sumSelected, shippingFee, grandTotal } from './cart.calc.js';

function toggleSelect(id) {
  const items = store.getItems();
  const newItems = items.map(it => it.id === id ? { ...it, selected: !it.selected } : it);
  store.setItems(newItems);
}

function toggleSelectAll(flag) {
  const items = store.getItems();
  const desired = Boolean(flag);
  const newItems = items.map(it => ({ ...it, selected: desired }));
  store.setItems(newItems);
}

function normalizeQty(qty) {
  const n = Number.parseInt(qty, 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

function updateQty(id, qty) {
  const norm = normalizeQty(qty);
  const items = store.getItems();
  const newItems = items.map(it => it.id === id ? { ...it, qty: norm } : it);
  store.setItems(newItems);
}

function incrementQty(id) {
  const items = store.getItems();
  const newItems = items.map(it => it.id === id ? { ...it, qty: normalizeQty((it.qty || 0) + 1) } : it);
  store.setItems(newItems);
}

function decrementQty(id) {
  const items = store.getItems();
  const newItems = items.map(it => {
    if (it.id !== id) return it;
    const next = normalizeQty((it.qty || 0) - 1);
    return { ...it, qty: next };
  });
  store.setItems(newItems);
}

function removeItem(id) {
  const items = store.getItems();
  const newItems = items.filter(it => it.id !== id);
  store.setItems(newItems);
}

function getSnapshot() {
  const items = store.getItems();
  const selectedSum = sumSelected(items);
  const shipping = shippingFee(selectedSum);
  const total = grandTotal(selectedSum);
  return { items, selectedSum, shipping, total };
}

export {
  toggleSelect,
  toggleSelectAll,
  updateQty,
  incrementQty,
  decrementQty,
  removeItem,
  getSnapshot,
};

