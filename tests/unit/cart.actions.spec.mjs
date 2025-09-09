import { it, expect } from '../helpers/harness.mjs';
import { store } from '../../src/business/cart.store.js';
import * as actions from '../../src/business/cart.actions.js';

function setup(items) {
  let state = JSON.parse(JSON.stringify(items));
  store.getItems = () => JSON.parse(JSON.stringify(state));
  store.setItems = (next) => { state = JSON.parse(JSON.stringify(next)); };
  return {
    get state() { return JSON.parse(JSON.stringify(state)); }
  };
}

const baseItems = [
  { id:'x', name:'X', price: 10000, qty: 1, selected: false },
  { id:'y', name:'Y', price: 20000, qty: 2, selected: true },
];

it('increment/decrement/updateQty keep min 1 and normalize non-numbers', () => {
  const ctx = setup(baseItems);
  actions.updateQty('x', 'abc'); // -> 1
  let s = actions.getSnapshot();
  expect(s.items.find(i=>i.id==='x').qty).toBe(1);

  actions.incrementQty('x');
  s = actions.getSnapshot();
  expect(s.items.find(i=>i.id==='x').qty).toBe(2);

  actions.decrementQty('x');
  s = actions.getSnapshot();
  expect(s.items.find(i=>i.id==='x').qty).toBe(1);

  actions.decrementQty('x'); // should stay at 1
  s = actions.getSnapshot();
  expect(s.items.find(i=>i.id==='x').qty).toBe(1);
});

it('removeItem removes by id', () => {
  const ctx = setup(baseItems);
  actions.removeItem('y');
  const s = actions.getSnapshot();
  expect(!!s.items.find(i=>i.id==='y')).toBe(false);
  expect(!!s.items.find(i=>i.id==='x')).toBe(true);
});

it('toggleSelectAll selects or deselects all', () => {
  const ctx = setup(baseItems);
  actions.toggleSelectAll(true);
  let s = actions.getSnapshot();
  expect(s.items.every(i=>i.selected)).toBe(true);

  actions.toggleSelectAll(false);
  s = actions.getSnapshot();
  expect(s.items.every(i=>!i.selected)).toBe(true);
});

it('snapshot has selectedSum, shipping, total computed correctly', () => {
  const ctx = setup([
    { id:'a', name:'A', price: 10000, qty: 1, selected: true },
    { id:'b', name:'B', price: 20000, qty: 1, selected: false },
    { id:'c', name:'C', price: 19999, qty: 1, selected: true },
  ]);
  const s = actions.getSnapshot();
  expect(s.selectedSum).toBe(10000 + 19999);
  expect(s.shipping).toBe(3000); // 29999 < 50000
  expect(s.total).toBe(s.selectedSum + s.shipping);
});

