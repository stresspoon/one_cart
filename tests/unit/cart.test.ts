// Framework neutral tests (Jest/Vitest compatible)
import * as cart from '../../core/cart.ts';
import { CartState } from '../../core/types.ts';

describe('cart.getTotals', () => {
  const base: CartState = {
    items: [
      { id: 'p1', title: 'A', price: 20000, qty: 1, selected: true },
      { id: 'p2', title: 'B', price: 35000, qty: 1, selected: false },
    ],
    updatedAt: Date.now(),
  };

  it('0 selected → subtotal 0, shipping 0, total 0', () => {
    const s0: CartState = { ...base, items: base.items.map(i => ({ ...i, selected: false })) };
    const t = cart.getTotals(s0);
    expect(t.subtotal).toBe(0);
    expect(t.shipping).toBe(0);
    expect(t.grandTotal).toBe(0);
    expect(t.selectedCount).toBe(0);
  });

  it('subtotal 49,999 → shipping 3,000', () => {
    const s1: CartState = { items: [{ id:'x', title:'X', price: 49999, qty:1, selected:true }], updatedAt: Date.now() };
    const t = cart.getTotals(s1);
    expect(t.subtotal).toBe(49999);
    expect(t.shipping).toBe(3000);
    expect(t.grandTotal).toBe(52999);
  });

  it('subtotal 50,000 → shipping 0', () => {
    const s2: CartState = { items: [{ id:'x', title:'X', price: 50000, qty:1, selected:true }], updatedAt: Date.now() };
    const t = cart.getTotals(s2);
    expect(t.subtotal).toBe(50000);
    expect(t.shipping).toBe(0);
    expect(t.grandTotal).toBe(50000);
  });
});

describe('cart selection and qty', () => {
  const s: CartState = {
    items: [
      { id: 'p1', title: 'A', price: 20000, qty: 1, selected: true },
      { id: 'p2', title: 'B', price: 35000, qty: 1, selected: false },
    ],
    updatedAt: Date.now(),
  };

  it('toggleSelect flips selected', () => {
    const s1 = cart.toggleSelect(s, 'p1');
    expect(s1.items.find(i => i.id==='p1')!.selected).toBe(false);
    const s2 = cart.toggleSelect(s1, 'p1');
    expect(s2.items.find(i => i.id==='p1')!.selected).toBe(true);
  });

  it('toggleSelect non-existing id is no-op', () => {
    const s1 = cart.toggleSelect(s, 'nope');
    expect(s1.items).toEqual(s.items);
  });

  it('toggleSelectAll true/false', () => {
    const all = cart.toggleSelectAll(s, true);
    expect(all.items.every(i => i.selected)).toBe(true);
    const none = cart.toggleSelectAll(all, false);
    expect(none.items.every(i => !i.selected)).toBe(true);
  });

  it('updateQty inc/dec/absolute and floor at 1', () => {
    const i1 = cart.updateQty(s, 'p1', 'inc');
    expect(i1.items.find(i=>i.id==='p1')!.qty).toBe(2);
    const i0 = cart.updateQty(i1, 'p1', 'dec');
    expect(i0.items.find(i=>i.id==='p1')!.qty).toBe(1);
    const abs = cart.updateQty(s, 'p1', 7);
    expect(abs.items.find(i=>i.id==='p1')!.qty).toBe(7);
    const guard = cart.updateQty(s, 'p1', 0);
    expect(guard.items.find(i=>i.id==='p1')!.qty).toBe(1);
  });

  it('immutability: input state unchanged', () => {
    const beforeJson = JSON.stringify(s);
    const after = cart.toggleSelect(s, 'p1');
    expect(JSON.stringify(s)).toBe(beforeJson);
    expect(JSON.stringify(after)).not.toBe(beforeJson);
  });
});

