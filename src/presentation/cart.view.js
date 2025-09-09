import { formatKRW } from '../business/cart.domain.js';

let appEl;
let handlers = {
  onSelectAll: () => {},
  onSelectItem: () => {},
  onQtyChange: () => {},
  onRemove: () => {},
};

function bindHandlers(h) {
  handlers = { ...handlers, ...h };
}

function itemRowHTML(it) {
  const subtotal = it.price * it.qty;
  return `
  <article class="item-card" data-id="${it.id}">
    <div class="thumb" aria-hidden="true">
      <img src="${it.imageUrl}" alt="${it.name} 이미지" onerror="this.alt='이미지 로드 실패';this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 120\'%3E%3Crect width=\'200\' height=\'120\' fill=\'%23eee\'/%3E%3C/svg%3E'" />
    </div>
    <div class="title">
      <input class="item-select" type="checkbox" aria-label="${it.name} 선택" ${it.selected ? 'checked' : ''} />
      <div>
        <div class="name">${it.name}</div>
        <div class="price">단가 ${formatKRW(it.price)} · 소계 ${formatKRW(subtotal)}</div>
      </div>
    </div>
    <div class="actions">
      <button class="item-remove icon" aria-label="${it.name} 삭제" title="삭제">✕</button>
    </div>
    <div class="controls">
      <div class="qty" role="group" aria-label="수량 조절">
        <button class="qty-dec" aria-label="수량 감소">–</button>
        <input class="qty-input" type="number" min="1" value="${it.qty}" aria-live="polite" aria-label="수량 입력" />
        <button class="qty-inc" aria-label="수량 증가">+</button>
      </div>
    </div>
  </article>`;
}

function itemsHTML(items) {
  return items.map(itemRowHTML).join('\n');
}

function summaryHTML(snapshot) {
  return `
  <div class="summary" role="region" aria-label="결제 요약">
    <div class="totals" role="status" aria-live="polite">
      <div class="row"><span class="label">상품합계</span><span class="value" data-field="sum">${formatKRW(snapshot.selectedSum)}</span></div>
      <div class="row"><span class="label">배송비</span><span class="value" data-field="ship">${formatKRW(snapshot.shipping)}</span></div>
      <div class="row"><span class="label">총액</span><span class="value" data-field="total">${formatKRW(snapshot.total)}</span></div>
    </div>
    <button class="cta" ${snapshot.selectedSum > 0 ? '' : 'disabled'} aria-disabled="${snapshot.selectedSum > 0 ? 'false' : 'true'}">결제하기</button>
  </div>`;
}

function render(snapshot) {
  appEl = document.getElementById('app');
  appEl.innerHTML = `
    <header class="cart-header">
      <div class="left">
        <label class="inline">
          <input id="select-all" type="checkbox" aria-label="전체 선택" />
          <span>전체 선택</span>
        </label>
      </div>
    </header>
    <section class="item-list" id="item-list">${itemsHTML(snapshot.items)}</section>
    ${summaryHTML(snapshot)}
  `;

  // Delegated events
  appEl.addEventListener('change', onChange, true);
  appEl.addEventListener('click', onClick, true);

  // Initial "select all" state
  updateSelectAll(snapshot.items);
}

function update(snapshot) {
  const list = appEl.querySelector('#item-list');
  if (list) list.innerHTML = itemsHTML(snapshot.items);

  const summaryHost = appEl.querySelector('.summary');
  if (summaryHost) summaryHost.outerHTML = summaryHTML(snapshot);

  updateSelectAll(snapshot.items);
}

function updateSelectAll(items) {
  const all = items.length > 0 && items.every(it => it.selected);
  const selectAll = appEl.querySelector('#select-all');
  if (selectAll) {
    selectAll.checked = all;
    selectAll.indeterminate = !all && items.some(it => it.selected);
  }
}

function onChange(e) {
  const t = e.target;
  const card = t.closest('.item-card');
  if (!t) return;

  if (t.id === 'select-all' && t.type === 'checkbox') {
    handlers.onSelectAll?.(t.checked);
    return;
  }

  if (t.classList.contains('item-select') && card) {
    handlers.onSelectItem?.(card.dataset.id);
    return;
  }

  if (t.classList.contains('qty-input') && card) {
    const id = card.dataset.id;
    const qty = parseInt(t.value, 10);
    handlers.onQtyChange?.(id, qty);
    return;
  }
}

function onClick(e) {
  const t = e.target;
  const card = t.closest('.item-card');
  if (!t) return;

  if (t.classList.contains('qty-inc') && card) {
    const input = card.querySelector('.qty-input');
    const id = card.dataset.id;
    const next = (parseInt(input.value, 10) || 1) + 1;
    handlers.onQtyChange?.(id, next);
    return;
  }
  if (t.classList.contains('qty-dec') && card) {
    const input = card.querySelector('.qty-input');
    const id = card.dataset.id;
    const next = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
    handlers.onQtyChange?.(id, next);
    return;
  }
  if (t.classList.contains('item-remove') && card) {
    handlers.onRemove?.(card.dataset.id);
    return;
  }
}

export { render, update, bindHandlers };

