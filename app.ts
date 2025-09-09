import * as storage from './core/storage';
import * as cart from './core/cart';
import { CartState } from './core/types';
import { render } from './ui/cart-view';

let state: CartState;

function update(next: CartState) {
  state = cart.coerceState(next);
  storage.saveState(state);
  render(state, cart.getTotals(state));
}

function bootstrap() {
  state = storage.ensureSeed();
  render(state, cart.getTotals(state));

  const root = document.getElementById('cart-root');
  const totalsRoot = document.getElementById('totals-root');
  const selectAll = document.getElementById('select-all') as HTMLInputElement | null;

  if (!root || !totalsRoot) return;

  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const row = target.closest('.cart-row') as HTMLElement | null;
    const id = row?.getAttribute('data-id') || '';
    const action = target.getAttribute('data-action');
    if (!action || !id) return;
    if (action === 'inc') {
      update(cart.updateQty(state, id, +1));
    } else if (action === 'dec') {
      update(cart.updateQty(state, id, -1));
    }
  });

  root.addEventListener('change', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const row = target.closest('.cart-row') as HTMLElement | null;
    const id = row?.getAttribute('data-id') || '';
    const action = target.getAttribute('data-action');
    if (!action) return;
    if (action === 'toggle-select' && id) {
      update(cart.toggleSelect(state, id));
    }
    if (action === 'set-qty' && id) {
      const input = target as HTMLInputElement;
      const parsed = parseInt(input.value.replace(/\D+/g, ''), 10);
      const nextQty = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
      update(cart.updateQty(state, id, nextQty));
    }
  });

  selectAll?.addEventListener('change', () => {
    if (!selectAll) return;
    update(cart.toggleSelectAll(state, selectAll.checked));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

