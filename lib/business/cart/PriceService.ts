import { SHIPPING_FEE, SHIPPING_THRESHOLD } from './CartTypes';

export const PriceService = {
  sumSelected: (unitPrices: (number | undefined)[], quantities: number[], selectedFlags: boolean[]): number => {
    let sum = 0;
    for (let i = 0; i < quantities.length; i++) {
      if (!selectedFlags[i]) continue;
      const price = unitPrices[i] ?? 0;
      const qty = quantities[i] ?? 0;
      sum += price * qty;
    }
    return sum;
  },
  shipping: (selectedSum: number): number => {
    return selectedSum < SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
  },
  grandTotal: (selectedSum: number, fee: number): number => selectedSum + fee,
  formatKRW: (amount: number): string =>
    new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(amount),
};

