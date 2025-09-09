import * as storeModule from './cart.store.js';
import { derive } from './cart.calc.js';

let store = storeModule; // DI for tests
export function setStore(mock){ store = mock; }

function update(mapper){
  const items = store.getItems();
  const next = items.map(mapper);
  store.setItems(next);
  return next;
}

export function toggleSelect(id){
  update(it => it.id === id ? { ...it, selected: !it.selected } : it);
}

export function toggleSelectAll(flag){
  const f = !!flag;
  update(it => ({ ...it, selected: f }));
}

export function updateQty(id, qty){
  const q = Number.isFinite(qty) ? Math.max(1, Math.trunc(qty)) : 1;
  update(it => it.id === id ? { ...it, qty: q } : it);
}

export function incrementQty(id){
  update(it => it.id === id ? { ...it, qty: Math.max(1, Math.trunc(it.qty)+1) } : it);
}

export function decrementQty(id){
  update(it => it.id === id ? { ...it, qty: Math.max(1, Math.trunc(it.qty)-1) } : it);
}

export function removeItem(id){
  const items = store.getItems();
  const next = items.filter(it => it.id !== id);
  store.setItems(next);
}

export function getSnapshot(){
  const items = store.getItems();
  const { selectedSum, shipping, total, selectedCount } = derive(items);
  return { items, selectedSum, shipping, total, selectedCount };
}

