import * as storage from './core/storage.ts';
import * as cart from './core/cart.ts';
import * as view from './ui/cart-view.ts';
import { CartState } from './core/types.ts';

let state: CartState;

function persist(next: CartState) {
  state = next;
  storage.save(storage.getKey(), state);
  view.render(state, cart.getTotals(state));
}

function main() {
  state = storage.ensureSeed();

  view.bind({
    onToggleSelect: (id) => persist(cart.toggleSelect(state, id)),
    onToggleSelectAll: (flag) => persist(cart.toggleSelectAll(state, flag)),
    onInc: (id) => persist(cart.updateQty(state, id, 'inc')),
    onDec: (id) => persist(cart.updateQty(state, id, 'dec')),
    onChangeQty: (id, qty) => persist(cart.updateQty(state, id, qty)),
    onRemove: (id) => persist(cart.removeItem(state, id)),
  });

  view.render(state, cart.getTotals(state));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

