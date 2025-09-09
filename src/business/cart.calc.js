import { SHIPPING_THRESHOLD, SHIPPING_FEE } from './cart.domain.js';

export function sumSelected(items) {
  return items.reduce((acc, it) => acc + (it.selected ? (it.price * it.qty) : 0), 0);
}

export function shippingFee(sum) {
  if (sum <= 0) return 0;
  return sum < SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
}

export function grandTotal(sum) {
  return sum + shippingFee(sum);
}

