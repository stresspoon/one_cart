import { SHIPPING_THRESHOLD, SHIPPING_FEE } from './cart.domain.js';

export function sumSelected(items) {
  return items.reduce((acc, it) => {
    if (it && it.selected) {
      const qty = Number.isFinite(it.qty) ? it.qty : 0;
      const price = Number.isFinite(it.price) ? it.price : 0;
      return acc + price * qty;
    }
    return acc;
  }, 0);
}

export function shippingFee(selectedSum) {
  const sum = Number(selectedSum) || 0;
  if (sum > 0 && sum < SHIPPING_THRESHOLD) return SHIPPING_FEE;
  return 0;
}

export function grandTotal(selectedSum) {
  const sum = Number(selectedSum) || 0;
  return sum + shippingFee(sum);
}

