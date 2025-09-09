import * as actions from '../../src/business/cart.actions.js';
import { derive } from '../../src/business/cart.calc.js';

describe('cart.actions with mocked store', () => {
  let items; let applied;
  const mockStore = {
    getItems: () => items,
    setItems: (next) => { items = next; applied = true; },
  };

  beforeEach(() => {
    items = [
      { id:'a', name:'A', price:10000, qty:1, selected:true },
      { id:'b', name:'B', price:20000, qty:2, selected:false },
    ];
    applied = false;
    actions.setStore(mockStore);
  });

  it('toggleSelect flips selected', () => {
    actions.toggleSelect('a');
    expect(items.find(i=>i.id==='a').selected).toBe(false);
    expect(applied).toBe(true);
  });

  it('toggleSelectAll true then false', () => {
    actions.toggleSelectAll(true);
    expect(items.every(i=>i.selected)).toBe(true);
    actions.toggleSelectAll(false);
    expect(items.every(i=>!i.selected)).toBe(true);
  });

  it('updateQty clamps at min 1', () => {
    actions.updateQty('a', 5);
    expect(items.find(i=>i.id==='a').qty).toBe(5);
    actions.updateQty('a', 0);
    expect(items.find(i=>i.id==='a').qty).toBe(1);
  });

  it('increment/decrement work', () => {
    actions.incrementQty('a');
    expect(items.find(i=>i.id==='a').qty).toBe(2);
    actions.decrementQty('a');
    expect(items.find(i=>i.id==='a').qty).toBe(1);
  });

  it('removeItem removes by id', () => {
    actions.removeItem('b');
    expect(items.some(i=>i.id==='b')).toBe(false);
  });

  it('getSnapshot returns derived totals', () => {
    const snap = actions.getSnapshot();
    const derived = derive(items);
    expect(snap.selectedSum).toBe(derived.selectedSum);
    expect(snap.total).toBe(derived.total);
  });
});

