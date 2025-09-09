import { SHIPPING_FEE, SHIPPING_THRESHOLD } from './cart.domain.js';

export function sumSelected(items){
  return items.filter(i => i.selected).reduce((acc, it) => acc + (toInt(it.price) * toInt(it.qty)), 0);
}

export function shippingFee(selectedSum){
  const s = toInt(selectedSum);
  if(s === 0) return 0;
  return s < SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
}

export function grandTotal(selectedSum){
  const s = toInt(selectedSum);
  return s + shippingFee(s);
}

export function derive(items){
  const selectedSum = sumSelected(items);
  const shipping = shippingFee(selectedSum);
  const total = selectedSum + shipping;
  const selectedCount = items.filter(i => i.selected).length;
  return { selectedSum, shipping, total, selectedCount };
}

function toInt(n){
  const x = Math.trunc(Number(n) || 0);
  return x < 0 ? 0 : x;
}

