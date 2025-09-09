import { CartItem, CartState, Totals } from './CartTypes';
import { PriceService } from './PriceService';

function mapItemsWithProducts(state: CartState): { priceList: number[]; qtyList: number[]; selList: boolean[] } {
  const productPriceById = new Map(state.products.map((p) => [p.id, p.unitPrice] as const));
  const priceList: number[] = [];
  const qtyList: number[] = [];
  const selList: boolean[] = [];
  for (const item of state.items) {
    priceList.push(productPriceById.get(item.productId) ?? 0);
    qtyList.push(item.quantity);
    selList.push(item.selected);
  }
  return { priceList, qtyList, selList };
}

export const CartSelectors = {
  selectedIds(state: CartState): string[] {
    return state.items.filter((i) => i.selected).map((i) => i.productId);
  },
  selectedCount(state: CartState): number {
    return state.items.reduce((acc, i) => acc + (i.selected ? 1 : 0), 0);
  },
  isAllSelected(state: CartState): boolean {
    if (state.items.length === 0) return false;
    return state.items.every((i) => i.selected);
  },
  totals(state: CartState): Totals {
    const { priceList, qtyList, selList } = mapItemsWithProducts(state);
    const selectedSum = PriceService.sumSelected(priceList, qtyList, selList);
    const shippingFee = PriceService.shipping(selectedSum);
    const grandTotal = PriceService.grandTotal(selectedSum, shippingFee);
    return { selectedSum, shippingFee, grandTotal };
  },
};

