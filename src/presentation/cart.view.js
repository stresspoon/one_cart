import { formatKRW } from '../business/cart.domain.js';

let handlers = null;

export function bindHandlers(h){ handlers = h; }

export function render(snapshot){
  const root = document.getElementById('app');
  if(!root) return;
  root.innerHTML = template(snapshot);
  attachDelegates(root);
}

export function update(snapshot){
  // naive full re-render for simplicity
  render(snapshot);
}

function template(s){
  const { items, selectedSum, shipping, total } = s;
  return `
  <div class="container" data-component="cart">
    <h1>장바구니</h1>
    <div class="toolbar">
      <label class="select-all">
        <input type="checkbox" id="select-all" ${allSelected(items) ? 'checked' : ''} ${someSelected(items) && !allSelected(items) ? 'aria-checked="mixed"' : ''} />
        전체 선택
      </label>
    </div>
    <section class="grid" id="list" aria-label="장바구니 목록">
      ${items.map(card).join('')}
    </section>
    <section class="summary" role="status" aria-live="polite">
      ${row('상품 합계', formatKRW(selectedSum))}
      ${row('배송비', shipping === 0 ? '무료' : formatKRW(shipping))}
      ${row('총 결제금액', formatKRW(total), true)}
    </section>
  </div>`;
}

function card(it){
  const line = formatKRW(it.price * it.qty);
  return `
    <article class="card ${it.selected ? 'selected':''}" data-id="${escapeHtml(it.id)}">
      <img class="thumb" alt="${escapeHtml(it.name)}" src="${it.imageUrl}" onerror="this.style.visibility='hidden'" />
      <div class="title">
        <input type="checkbox" class="sel" ${it.selected ? 'checked':''} aria-label="${escapeHtml(it.name)} 선택" />
        <span>${escapeHtml(it.name)}</span>
      </div>
      <div class="meta">
        <span class="price">${formatKRW(it.price)}</span>
        <span>× ${it.qty}</span>
        <span>= ${line}</span>
      </div>
      <div class="qty">
        <button type="button" data-action="dec" aria-label="수량 감소">−</button>
        <input type="number" min="1" value="${it.qty}" inputmode="numeric" aria-label="수량 입력" class="qty-input" />
        <button type="button" data-action="inc" aria-label="수량 증가">＋</button>
      </div>
      <div class="actions">
        <button type="button" data-action="remove" aria-label="삭제">삭제</button>
      </div>
    </article>`;
}

function row(label, value, emph=false){
  return `<div class="row ${emph?'total':''}"><span>${label}</span><strong>${value}</strong></div>`;
}

function attachDelegates(root){
  const list = root.querySelector('#list');
  const selectAll = root.querySelector('#select-all');

  if(selectAll){
    selectAll.addEventListener('change', (e)=>{
      handlers?.onSelectAll?.(e.target.checked);
    });
  }

  if(list){
    list.addEventListener('change', (e)=>{
      const t = e.target;
      const row = t.closest('.card');
      if(!row) return;
      const id = row.getAttribute('data-id');
      if(t.matches('input.sel')){
        handlers?.onSelectItem?.(id);
      }
      if(t.matches('input.qty-input')){
        const next = Number(t.value);
        handlers?.onQtyChange?.(id, Number.isFinite(next)? next : 1);
      }
    });

    list.addEventListener('click', (e)=>{
      const t = e.target;
      const row = t.closest('.card');
      if(!row) return;
      const id = row.getAttribute('data-id');
      if(t.matches('[data-action="inc"]')) handlers?.onQtyChange?.(id, getQty(row)+1);
      if(t.matches('[data-action="dec"]')) handlers?.onQtyChange?.(id, Math.max(1, getQty(row)-1));
      if(t.matches('[data-action="remove"]')) handlers?.onRemove?.(id);
    });
  }
}

function getQty(row){
  const input = row.querySelector('input.qty-input');
  return Math.max(1, Math.trunc(Number(input.value)||1));
}

function allSelected(items){ return items.length>0 && items.every(i=>i.selected); }
function someSelected(items){ return items.some(i=>i.selected); }

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[ch]));
}

