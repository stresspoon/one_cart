import { CartItem, CartState, Totals } from '../core/types.ts';
import { formatKRW } from './format.ts';

export type ViewHandlers = {
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (flag: boolean) => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onChangeQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
};

let handlers: ViewHandlers | null = null;

export function bind(h: ViewHandlers) {
  handlers = h;

  const root = document.getElementById('cart-root')!;
  const selectAll = document.getElementById('select-all') as HTMLInputElement | null;

  // Event delegation for item interactions
  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const row = target.closest('[data-id]') as HTMLElement | null;
    if (!row) return;
    const id = row.dataset.id!;

    if (target.matches('[data-action="inc"]')) {
      handlers?.onInc(id);
    } else if (target.matches('[data-action="dec"]')) {
      handlers?.onDec(id);
    } else if (target.matches('[data-action="remove"]')) {
      handlers?.onRemove(id);
    }
  });

  root.addEventListener('change', (e) => {
    const target = e.target as HTMLElement;
    const row = target.closest('[data-id]') as HTMLElement | null;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      const id = row?.dataset.id;
      if (id) handlers?.onToggleSelect(id);
      return;
    }
    if (target instanceof HTMLInputElement && target.dataset.role === 'qty') {
      const id = row?.dataset.id;
      if (!id) return;
      const next = Number(target.value);
      handlers?.onChangeQty(id, Number.isFinite(next) ? next : 1);
    }
  });

  selectAll?.addEventListener('change', (e) => {
    const el = e.target as HTMLInputElement;
    handlers?.onToggleSelectAll(el.checked);
  });
}

export function render(state: CartState, totals: Totals) {
  // Keep select-all checkbox in sync
  const selectAllEl = document.getElementById('select-all') as HTMLInputElement | null;
  if (selectAllEl) {
    const allSelected = state.items.length > 0 && state.items.every(it => it.selected);
    selectAllEl.checked = allSelected;
    selectAllEl.indeterminate = state.items.some(it => it.selected) && !allSelected;
  }

  const root = document.getElementById('cart-root');
  const totalsRoot = document.getElementById('totals-root');
  if (!root || !totalsRoot) return;

  root.innerHTML = state.items.map(renderItem).join('');

  totalsRoot.innerHTML = [
    row('선택 상품 금액', formatKRW(totals.subtotal, true)),
    row('배송비', totals.shipping === 0 ? '무료' : formatKRW(totals.shipping, true)),
    row('총 결제금액', formatKRW(totals.grandTotal, true), true),
  ].join('');
}

function renderItem(it: CartItem): string {
  const price = formatKRW(it.price, true);
  const line = formatKRW(it.price * it.qty, true);
  return `
  <article class="cart-item ${it.selected ? 'selected' : ''}" data-id="${it.id}">
    <img class="ci-img" alt="${escapeHtml(it.title)}" src="${it.image || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'64\' height=\'64\'><rect width=\'100%\' height=\'100%\' fill=\'%23ddd\'/></svg>'}" />
    <div class="ci-title">
      <input type="checkbox" ${it.selected ? 'checked' : ''} aria-label="${escapeHtml(it.title)} 선택" />
      <span>${escapeHtml(it.title)}</span>
    </div>
    <div class="ci-meta">
      <span class="price">${price}</span>
      <span>× ${it.qty}</span>
      <span>= ${line}</span>
    </div>
    <div class="ci-qty">
      <button type="button" data-action="dec" aria-label="수량 감소">−</button>
      <input inputmode="numeric" pattern="[0-9]*" data-role="qty" type="number" min="1" value="${it.qty}" aria-label="수량 입력" />
      <button type="button" data-action="inc" aria-label="수량 증가">＋</button>
    </div>
    <div class="ci-actions">
      <button type="button" data-action="remove" aria-label="상품 삭제">삭제</button>
    </div>
  </article>`;
}

function row(label: string, value: string, emph = false): string {
  return `<div class="totals-row ${emph ? 'total' : ''}"><span>${label}</span><strong>${value}</strong></div>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as any)[ch] || ch);
}
