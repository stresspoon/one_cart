// Store mocking + action specs (lightweight)
import { actions } from '../../src/business/cart.actions.js';
import { store as realStore } from '../../src/business/cart.store.js';

function it(name, fn) { try { fn(); console.log('✓', name); } catch (e) { console.error('✗', name); console.error(e); } }
function expect(actual) { return { toBe: (v) => console.assert(Object.is(actual, v), `${actual} !== ${v}`), toEqual: (v) => console.assert(JSON.stringify(actual) === JSON.stringify(v), `${JSON.stringify(actual)} !== ${JSON.stringify(v)}`) }; }

// Mock store
const mock = (() => {
  let items = [
    { id: 'a', name: 'A', price: 1000, qty: 1, selected: false },
    { id: 'b', name: 'B', price: 2000, qty: 2, selected: true },
  ];
  const settings = { colors: [], version: 'test' };
  return {
    getItems: () => items,
    setItems: (next) => { items = next; },
    getSettings: () => settings,
    setSettings: () => {},
    _get: () => items,
  };
})();

// Swap store methods temporarily
const original = {
  getItems: realStore.getItems,
  setItems: realStore.setItems,
};
realStore.getItems = mock.getItems;
realStore.setItems = mock.setItems;

it('toggleSelectAll sets all items selected', () => {
  actions.toggleSelectAll(true);
  expect(mock._get().every(i => i.selected)).toBe(true);
  actions.toggleSelectAll(false);
  expect(mock._get().every(i => !i.selected)).toBe(true);
});

it('updateQty normalizes invalid qty to 1', () => {
  actions.updateQty('a', 0);
  expect(mock._get().find(i => i.id === 'a').qty).toBe(1);
  actions.updateQty('a', -5);
  expect(mock._get().find(i => i.id === 'a').qty).toBe(1);
});

it('increment/decrement qty within normalization', () => {
  actions.updateQty('a', 5);
  actions.incrementQty('a');
  expect(mock._get().find(i => i.id === 'a').qty).toBe(6);
  actions.decrementQty('a');
  expect(mock._get().find(i => i.id === 'a').qty).toBe(5);
  actions.decrementQty('a');
  actions.decrementQty('a');
  actions.decrementQty('a');
  actions.decrementQty('a');
  actions.decrementQty('a'); // attempt to go below 1
  expect(mock._get().find(i => i.id === 'a').qty).toBe(1);
});

it('removeItem removes a specific item', () => {
  actions.removeItem('b');
  expect(mock._get().some(i => i.id === 'b')).toBe(false);
});

it('getSnapshot computes sums and flags', () => {
  const snap = actions.getSnapshot();
  expect(typeof snap.selectedSum).toBe('number');
  expect(typeof snap.total).toBe('number');
  expect(typeof snap.allSelected).toBe('boolean');
});

// Restore real store
realStore.getItems = original.getItems;
realStore.setItems = original.setItems;

