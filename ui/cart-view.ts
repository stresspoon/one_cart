import { CartItem, CartState, Totals } from '../core/types';
import { formatKRW } from './format';

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function itemRow(item: CartItem): HTMLElement {
  const row = el('div', 'cart-row');
  row.setAttribute('data-id', item.id);

  const sel = el('input') as HTMLInputElement;
  sel.type = 'checkbox';
  sel.className = 'cart-cell select';
  sel.checked = item.selected;
  sel.setAttribute('data-action', 'toggle-select');
  sel.setAttribute('aria-label', `${item.title} 선택`);

  const title = el('div', 'cart-cell title');
  title.textContent = item.title;

  const price = el('div', 'cart-cell price');
  price.textContent = formatKRW(item.price, true);

  const qty = el('div', 'cart-cell qty');
  const minus = el('button', 'qty-btn');
  minus.textContent = '−';
  minus.setAttribute('data-action', 'dec');
  minus.type = 'button';
  minus.disabled = item.qty <= 1;
  const input = el('input', 'qty-input') as HTMLInputElement;
  input.type = 'text';
  input.value = String(item.qty);
  input.setAttribute('inputmode', 'numeric');
  input.setAttribute('pattern', '[0-9]*');
  input.setAttribute('data-action', 'set-qty');
  input.setAttribute('aria-label', `${item.title} 수량`);
  const plus = el('button', 'qty-btn');
  plus.textContent = '+';
  plus.setAttribute('data-action', 'inc');
  plus.type = 'button';
  qty.append(minus, input, plus);

  const total = el('div', 'cart-cell line-total');
  total.textContent = formatKRW(item.price * item.qty, true);

  row.append(sel, title, price, qty, total);
  if (item.selected) row.classList.add('selected');
  return row;
}

function totalsView(totals: Totals): HTMLElement {
  const wrap = el('div', 'totals');
  const s1 = el('div', 'totals-row');
  s1.innerHTML = `<span>상품 금액</span><strong>${formatKRW(totals.subtotal, true)}</strong>`;
  const s2 = el('div', 'totals-row');
  s2.innerHTML = `<span>배송비</span><strong>${formatKRW(totals.shipping, true)}</strong>`;
  const s3 = el('div', 'totals-row grand');
  s3.innerHTML = `<span>총 결제금액</span><strong>${formatKRW(totals.grandTotal, true)}</strong>`;
  wrap.append(s1, s2, s3);
  return wrap;
}

export function render(state: CartState, totals: Totals): void {
  const root = document.getElementById('cart-root');
  const totalsRoot = document.getElementById('totals-root');
  const selectAll = document.getElementById('select-all') as HTMLInputElement | null;
  if (!root || !totalsRoot) return;

  root.innerHTML = '';
  const header = el('div', 'cart-header');
  header.innerHTML = `
    <div class="cart-cell select">선택</div>
    <div class="cart-cell title">상품</div>
    <div class="cart-cell price">가격</div>
    <div class="cart-cell qty">수량</div>
    <div class="cart-cell line-total">합계</div>
  `;
  root.append(header);

  state.items.forEach((it) => root.append(itemRow(it)));

  if (selectAll) {
    const allSelected = state.items.length > 0 && state.items.every((it) => it.selected);
    selectAll.checked = allSelected;
    selectAll.indeterminate = !allSelected && state.items.some((it) => it.selected);
  }

  totalsRoot.setAttribute('aria-live', 'polite');
  totalsRoot.innerHTML = '';
  totalsRoot.append(totalsView(totals));
}

