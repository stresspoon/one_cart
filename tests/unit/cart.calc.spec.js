// Lightweight spec using console.assert for boundaries
import { sumSelected, shippingFee, grandTotal } from '../../src/business/cart.calc.js';

function it(name, fn) { try { fn(); console.log('✓', name); } catch (e) { console.error('✗', name); console.error(e); } }
function expect(actual) { return { toBe: (v) => console.assert(Object.is(actual, v), `${actual} !== ${v}`) }; }

const items = [
  { price: 10000, qty: 2, selected: true }, // 20000
  { price: 5000, qty: 3, selected: false }, // 0
  { price: 15000, qty: 1, selected: true }, // 15000 => total=35000
];

it('sumSelected sums only selected items', () => {
  expect(sumSelected(items)).toBe(35000);
});

it('shippingFee boundary: 0 → 0원', () => {
  expect(shippingFee(0)).toBe(0);
});

it('shippingFee boundary: 49,999 → 3,000원', () => {
  expect(shippingFee(49999)).toBe(3000);
});

it('shippingFee boundary: 50,000 → 0원', () => {
  expect(shippingFee(50000)).toBe(0);
});

it('grandTotal = sum + shipping', () => {
  expect(grandTotal(35000)).toBe(35000 + 3000);
  expect(grandTotal(50000)).toBe(50000 + 0);
});

