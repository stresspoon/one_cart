import { SHIPPING_FEE, SHIPPING_THRESHOLD } from './CartTypes';
import type { CartState } from './CartTypes';

export const PriceService = {
  sumSelected(cart: CartState): number {
    const map = new Map(cart.products.map((p) => [p.id, p.unitPrice] as const));
    return cart.items
      .filter((i) => i.selected)
      .reduce((acc, i) => acc + (map.get(i.productId) ?? 0) * Math.max(1, i.quantity), 0);
  },

  shipping(sum: number): number {
    return sum < SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
  },

  grandTotal(sum: number, shipping: number): number {
    return sum + shipping;
  },

  formatKRW(amount: number): string {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  },
};

