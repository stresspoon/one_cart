import { SHIPPING_THRESHOLD, SHIPPING_FEE } from "./cart.domain.js";

export function sumSelected(items) {
  return items
    .filter((i) => i.selected)
    .reduce((acc, i) => acc + i.price * i.qty, 0);
}

export function shippingFee(sum) {
  if (sum > 0 && sum < SHIPPING_THRESHOLD) return SHIPPING_FEE;
  return 0;
}

export function grandTotal(sum) {
  return sum + shippingFee(sum);
}

