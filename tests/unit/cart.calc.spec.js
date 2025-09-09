import { sumSelected, shippingFee, grandTotal } from '../../src/business/cart.calc.js';

describe('cart.calc', () => {
  it('sumSelected sums only selected items', () => {
    const items = [
      { price: 1000, qty: 2, selected: true },
      { price: 500, qty: 3, selected: false },
      { price: 200, qty: 1, selected: true },
    ];
    expect(sumSelected(items)).toBe(1000*2 + 200*1);
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

  it('grandTotal adds sum and shipping', () => {
    const s = 40000; // shipping 3000
    expect(grandTotal(s)).toBe(43000);
  });
});

