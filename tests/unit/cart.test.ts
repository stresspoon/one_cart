// Framework-neutral unit tests (Jest/Vitest compatible semantics)
// These tests describe the expected behavior of the pure cart logic.

import * as cart from '../../core/cart';
import type { CartState } from '../../core/types';

function baseState(): CartState {
  return {
    items: [
      { id: 'p1', title: 'A', price: 20000, qty: 1, selected: true },
      { id: 'p2', title: 'B', price: 35000, qty: 1, selected: false },
    ],
    updatedAt: Date.now(),
  };
}

describe('getTotals()', () => {
  test('selected=0 => subtotal=0, shipping=0, grand=0', () => {
    const s = baseState();
    const s2 = cart.toggleSelect(s, 'p1'); // deselect A
    const t = cart.getTotals(s2);
    expect(t.subtotal).toBe(0);
    expect(t.shipping).toBe(0);
    expect(t.grandTotal).toBe(0);
  });

  test('subtotal 49,999 => shipping 3,000; grand 52,999', () => {
    const s: CartState = { items: [{ id: 'x', title: 'X', price: 49999, qty: 1, selected: true }], updatedAt: Date.now() };
    const t = cart.getTotals(s);
    expect(t.subtotal).toBe(49999);
    expect(t.shipping).toBe(3000);
    expect(t.grandTotal).toBe(52999);
  });

  test('subtotal 50,000 => shipping 0', () => {
    const s: CartState = { items: [{ id: 'x', title: 'X', price: 50000, qty: 1, selected: true }], updatedAt: Date.now() };
    const t = cart.getTotals(s);
    expect(t.subtotal).toBe(50000);
    expect(t.shipping).toBe(0);
    expect(t.grandTotal).toBe(50000);
  });
});

describe('toggleSelect()', () => {
  test('toggles selected flag', () => {
    const s = baseState();
    const s2 = cart.toggleSelect(s, 'p1');
    expect(s.items[0].selected).toBe(true);
    expect(s2.items[0].selected).toBe(false);
  });

  test('unknown id => no change', () => {
    const s = baseState();
    const s2 = cart.toggleSelect(s, 'nope');
    expect(JSON.stringify(s)).toBe(JSON.stringify(s2));
  });
});

describe('toggleSelectAll(flag)', () => {
  test('true => all selected', () => {
    const s = baseState();
    const s2 = cart.toggleSelectAll(s, true);
    expect(s2.items.every((i) => i.selected)).toBe(true);
  });
  test('false => all unselected', () => {
    const s = baseState();
    const s2 = cart.toggleSelectAll(s, false);
    expect(s2.items.every((i) => !i.selected)).toBe(true);
  });
});

describe('updateQty()', () => {
  test('+1 accumulates', () => {
    const s = baseState();
    const s2 = cart.updateQty(s, 'p1', +1);
    const s3 = cart.updateQty(s2, 'p1', +1);
    expect(s3.items.find((i) => i.id === 'p1')!.qty).toBe(3);
  });
  test('-1 stops at 1', () => {
    const s = baseState();
    const s2 = cart.updateQty(s, 'p1', -1);
    expect(s2.items.find((i) => i.id === 'p1')!.qty).toBe(1);
  });
  test('absolute sets value', () => {
    const s = baseState();
    const s2 = cart.updateQty(s, 'p1', 7);
    expect(s2.items.find((i) => i.id === 'p1')!.qty).toBe(7);
  });
  test('guards against invalid', () => {
    const s = baseState();
    const s2 = cart.updateQty(s, 'p1', NaN as unknown as number);
    expect(s2.items.find((i) => i.id === 'p1')!.qty).toBe(1);
  });
});

describe('immutability', () => {
  test('does not mutate original state', () => {
    const s = baseState();
    const t = cart.toggleSelect(s, 'p2');
    expect(s).not.toBe(t);
    expect(s.items).not.toBe(t.items);
  });
});

