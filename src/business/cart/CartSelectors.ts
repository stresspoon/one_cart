import type { CombinedState } from './CartTypes';
import { PriceService } from './PriceService';

export const CartSelectors = {
  selectedIds(state: CombinedState): string[] {
    return state.cart.items.filter((i) => i.selected).map((i) => i.productId);
  },

  isAllSelected(state: CombinedState): boolean {
    const items = state.cart.items;
    if (items.length === 0) return false;
    return items.every((i) => i.selected);
  },

  selectedCount(state: CombinedState): number {
    return state.cart.items.filter((i) => i.selected).length;
  },

  totals(state: CombinedState): { sum: number; shipping: number; grand: number } {
    const sum = PriceService.sumSelected(state.cart);
    const shipping = PriceService.shipping(sum);
    const grand = PriceService.grandTotal(sum, shipping);
    return { sum, shipping, grand };
  },
};

