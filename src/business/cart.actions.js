import { store } from './cart.store.js';
import { sumSelected, shippingFee, grandTotal } from './cart.calc.js';

function normalizeQty(n) {
  const v = Number.isFinite(n) ? n : parseInt(n, 10);
  return Number.isNaN(v) || v < 1 ? 1 : Math.floor(v);
}

export const actions = {
  toggleSelect(id) {
    const items = store.getItems();
    const next = items.map(it => it.id === id ? { ...it, selected: !it.selected } : it);
    store.setItems(next);
    return next;
  },

  toggleSelectAll(flag) {
    const items = store.getItems();
    const next = items.map(it => ({ ...it, selected: !!flag }));
    store.setItems(next);
    return next;
  },

  updateQty(id, qty) {
    const items = store.getItems();
    const q = normalizeQty(qty);
    const next = items.map(it => it.id === id ? { ...it, qty: q } : it);
    store.setItems(next);
    return next;
  },

  incrementQty(id) {
    const items = store.getItems();
    const next = items.map(it => it.id === id ? { ...it, qty: normalizeQty(it.qty + 1) } : it);
    store.setItems(next);
    return next;
  },

  decrementQty(id) {
    const items = store.getItems();
    const next = items.map(it => it.id === id ? { ...it, qty: normalizeQty(it.qty - 1) } : it);
    store.setItems(next);
    return next;
  },

  removeItem(id) {
    const items = store.getItems();
    const next = items.filter(it => it.id !== id);
    store.setItems(next);
    return next;
  },

  getSnapshot() {
    const items = store.getItems();
    const selectedSum = sumSelected(items);
    const shipping = shippingFee(selectedSum);
    const total = grandTotal(selectedSum);
    const count = items.length;
    const selectedCount = items.filter(i => i.selected).length;
    return {
      items,
      count,
      selectedCount,
      allSelected: count > 0 && selectedCount === count,
      anySelected: selectedCount > 0,
      selectedSum,
      shipping,
      total,
    };
  }
};

