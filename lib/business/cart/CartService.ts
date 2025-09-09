import { CartItem, CartState, UIState } from './CartTypes';
import { StorageGateway } from '../storage/StorageGateway';
import { seedProducts, seedItems, seedUI } from '../storage/SeedData';

function clampQty(q: number): number {
  const n = Number.isFinite(q) ? Math.floor(q) : 1;
  return n >= 1 ? n : 1;
}

function saveAll(state: CartState, ui: UIState): void {
  StorageGateway.saveProducts(state.products);
  StorageGateway.saveItems(state.items);
  StorageGateway.saveUI(ui);
}

export const CartService = {
  initState(): { state: CartState; ui: UIState } {
    const products = StorageGateway.loadProducts();
    const items = StorageGateway.loadItems();
    const ui = StorageGateway.loadUI();

    if (!products || !items || !ui) {
      const seeded = { state: { products: seedProducts, items: seedItems }, ui: seedUI };
      saveAll(seeded.state, seeded.ui);
      return seeded;
    }
    return { state: { products, items }, ui };
  },

  toggleItem(prev: CartState, prevUI: UIState, productId: string): { state: CartState; ui: UIState } {
    const items = prev.items.map((it) => (it.productId === productId ? { ...it, selected: !it.selected } : it));
    const allSelected = items.length > 0 && items.every((i) => i.selected);
    const nextUI: UIState = { selectAll: allSelected };
    const next = { state: { products: prev.products, items }, ui: nextUI };
    saveAll(next.state, next.ui);
    return next;
  },

  toggleAll(prev: CartState, _prevUI: UIState, flag: boolean): { state: CartState; ui: UIState } {
    const items = prev.items.map((it) => ({ ...it, selected: flag }));
    const nextUI: UIState = { selectAll: flag };
    const next = { state: { products: prev.products, items }, ui: nextUI };
    saveAll(next.state, next.ui);
    return next;
  },

  changeQty(prev: CartState, prevUI: UIState, productId: string, nextQty: number): { state: CartState; ui: UIState } {
    const items = prev.items.map((it) => (it.productId === productId ? { ...it, quantity: clampQty(nextQty) } : it));
    const allSelected = items.length > 0 && items.every((i) => i.selected);
    const nextUI: UIState = { selectAll: allSelected };
    const next = { state: { products: prev.products, items }, ui: nextUI };
    saveAll(next.state, next.ui);
    return next;
  },

  removeItem(prev: CartState, prevUI: UIState, productId: string): { state: CartState; ui: UIState } {
    const items = prev.items.filter((it) => it.productId !== productId);
    const allSelected = items.length > 0 && items.every((i) => i.selected);
    const nextUI: UIState = { selectAll: allSelected };
    const next = { state: { products: prev.products, items }, ui: nextUI };
    saveAll(next.state, next.ui);
    return next;
  },

  removeSelected(prev: CartState, prevUI: UIState): { state: CartState; ui: UIState } {
    const items = prev.items.filter((it) => !it.selected);
    const allSelected = items.length > 0 && items.every((i) => i.selected);
    const nextUI: UIState = { selectAll: allSelected };
    const next = { state: { products: prev.products, items }, ui: nextUI };
    saveAll(next.state, next.ui);
    return next;
  },
};

