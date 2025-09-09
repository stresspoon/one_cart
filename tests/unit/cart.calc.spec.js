// Unit tests for cart.calc.js
import { sumSelected, shippingFee, grandTotal } from "../../src/business/cart.calc.js";

function test(name, fn) {
  try { fn(); console.log("✓", name); }
  catch (e) { console.error("✗", name, "\n", e); }
}

test("sumSelected sums only selected items", () => {
  const items = [
    { price: 1000, qty: 2, selected: true },
    { price: 500, qty: 3, selected: false },
    { price: 200, qty: 1, selected: true },
  ];
  console.assert(sumSelected(items) === 1000 * 2 + 200 * 1, "sum mismatch");
});

// Boundary tests for shipping fee
test("shipping 0 → 0원", () => {
  console.assert(shippingFee(0) === 0, "expected 0");
});

test("shipping 49,999 → 3,000원", () => {
  console.assert(shippingFee(49999) === 3000, "expected 3000");
});

test("shipping 50,000 → 0원", () => {
  console.assert(shippingFee(50000) === 0, "expected 0");
});

test("grandTotal = sum + shipping", () => {
  console.assert(grandTotal(0) === 0, "0 total");
  console.assert(grandTotal(1000) === 1000 + 3000, "+shipping under threshold");
  console.assert(grandTotal(50000) === 50000, "no shipping at threshold");
});

