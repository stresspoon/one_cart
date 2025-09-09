import type { CombinedState } from './CartTypes';
import { CartSelectors } from './CartSelectors';
import { StorageGateway } from '../storage/StorageGateway';

export const CartService = {
  initState(): CombinedState {
    const seeded = StorageGateway.ensureSeeded();
    return { cart: { products: seeded.products, items: seeded.items }, ui: seeded.ui };
  },

  toggleItem(state: CombinedState, productId: string): CombinedState {
    const nextItems = state.cart.items.map((i) =>
      i.productId === productId ? { ...i, selected: !i.selected } : i
    );
    const nextCart = { ...state.cart, items: nextItems };
    const next = { cart: nextCart, ui: { ...state.ui, selectAll: nextItems.length > 0 && nextItems.every((i) => i.selected) } };
    StorageGateway.saveItems(next.cart.items);
    StorageGateway.saveUI(next.ui);
    return next;
  },

  toggleAll(state: CombinedState, flag: boolean): CombinedState {
    const nextItems = state.cart.items.map((i) => ({ ...i, selected: flag }));
    const next = { cart: { ...state.cart, items: nextItems }, ui: { ...state.ui, selectAll: flag } };
    StorageGateway.saveItems(next.cart.items);
    StorageGateway.saveUI(next.ui);
    return next;
  },

  changeQty(state: CombinedState, productId: string, nextQty: number): CombinedState {
    const qty = Number.isFinite(nextQty) ? Math.max(1, Math.floor(nextQty)) : 1;
    const nextItems = state.cart.items.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i));
    const next = { cart: { ...state.cart, items: nextItems }, ui: { ...state.ui, selectAll: CartSelectors.isAllSelected({ cart: { ...state.cart, items: nextItems }, ui: state.ui }) } };
    StorageGateway.saveItems(next.cart.items);
    StorageGateway.saveUI(next.ui);
    return next;
  },

  removeItem(state: CombinedState, productId: string): CombinedState {
    const nextItems = state.cart.items.filter((i) => i.productId !== productId);
    const next = { cart: { ...state.cart, items: nextItems }, ui: { ...state.ui, selectAll: nextItems.length > 0 && nextItems.every((i) => i.selected) } };
    StorageGateway.saveItems(next.cart.items);
    StorageGateway.saveUI(next.ui);
    return next;
  },

  removeSelected(state: CombinedState): CombinedState {
    const nextItems = state.cart.items.filter((i) => !i.selected);
    const next = { cart: { ...state.cart, items: nextItems }, ui: { ...state.ui, selectAll: false } };
    StorageGateway.saveItems(next.cart.items);
    StorageGateway.saveUI(next.ui);
    return next;
  },
};

