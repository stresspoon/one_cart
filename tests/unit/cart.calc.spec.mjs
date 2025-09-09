import { it, expect } from '../helpers/harness.mjs';
import { sumSelected, shippingFee, grandTotal } from '../../src/business/cart.calc.js';

const items = [
  { id:'a', price: 1000, qty: 2, selected: true },
  { id:'b', price: 2000, qty: 3, selected: false },
  { id:'c', price: 3000, qty: 1, selected: true },
];

it('sumSelected sums only selected items', () => {
  expect(sumSelected(items)).toBe(1000*2 + 3000*1);
});

it('shipping at 0 is 0', () => {
  expect(shippingFee(0)).toBe(0);
});

it('shipping at 49,999 is 3,000', () => {
  expect(shippingFee(49999)).toBe(3000);
});

it('shipping at 50,000 is 0', () => {
  expect(shippingFee(50000)).toBe(0);
});

it('grandTotal = sum + shipping', () => {
  const sum = 46000;
  expect(grandTotal(sum)).toBe(sum + 3000);
});

