import { formatKRW } from '../business/cart.domain.js';

function itemCardTemplate(it) {
  return `
    <article class="card" data-id="${it.id}">
      <div class="item__thumb">
        <img src="${it.imageUrl}" alt="${it.name}" />
      </div>
      <div class="item__info">
        <label class="row">
          <input type="checkbox" data-action="select" ${it.selected ? 'checked' : ''} aria-label="${it.name} 선택" />
          <span class="price">${formatKRW(it.price)}</span>
        </label>
        <div class="item__title" title="${it.name}">${it.name}</div>
        <div class="item__desc">${it.desc ?? ''}</div>
      </div>
      <div class="item__actions">
        <div class="qty" aria-label="수량 조절">
          <button type="button" class="btn" data-action="dec" aria-label="수량 감소">–</button>
          <input type="number" data-action="qty" min="1" value="${it.qty}" inputmode="numeric" aria-label="수량 입력" />
          <button type="button" class="btn" data-action="inc" aria-label="수량 증가">+</button>
        </div>
        <div class="muted">소계: <strong class="price">${formatKRW(it.price * it.qty)}</strong></div>
        <div class="spacer"></div>
        <button type="button" class="btn btn--danger" data-action="remove" aria-label="상품 삭제">삭제</button>
      </div>
    </article>
  `;
}

function headerTemplate(snapshot) {
  return `
    <div class="header">
      <div class="header__left">
        <label class="row">
          <input type="checkbox" data-action="select-all" ${snapshot.allSelected ? 'checked' : ''} aria-label="전체선택" />
          <span>전체선택 (${snapshot.selectedCount}/${snapshot.count})</span>
        </label>
      </div>
      <div class="header__right">
        <span class="muted">선택합: <strong class="price">${formatKRW(snapshot.selectedSum)}</strong></span>
      </div>
    </div>
  `;
}

function summaryTemplate(snapshot) {
  return `
    <section class="summary" role="status" aria-live="polite">
      <h2>결제 요약</h2>
      <div class="row"><span>선택합</span><span>${formatKRW(snapshot.selectedSum)}</span></div>
      <div class="row"><span>배송비</span><span>${formatKRW(snapshot.shipping)}</span></div>
      <hr />
      <div class="row total"><span>총액</span><span>${formatKRW(snapshot.total)}</span></div>
      <button type="button" class="btn btn--danger" aria-disabled="${!snapshot.anySelected}" ${!snapshot.anySelected ? 'disabled' : ''}>결제하기</button>
    </section>
  `;
}

export const view = {
  mount: null,

  init(mount) {
    this.mount = mount;
  },

  render(snapshot) {
    const listHtml = snapshot.items.map(itemCardTemplate).join('');
    this.mount.innerHTML = `
      <div class="container">
        ${headerTemplate(snapshot)}
        <div class="page">
          <section class="list" aria-label="장바구니 목록">
            ${listHtml}
          </section>
          ${summaryTemplate(snapshot)}
        </div>
      </div>
    `;
  },

  update(snapshot) {
    // Simple approach: re-render dynamic sections
    const headerContainer = this.mount.querySelector('.header');
    if (headerContainer) headerContainer.outerHTML = headerTemplate(snapshot);

    const listContainer = this.mount.querySelector('.list');
    if (listContainer) listContainer.innerHTML = snapshot.items.map(itemCardTemplate).join('');

    const summaryContainer = this.mount.querySelector('.summary');
    if (summaryContainer) summaryContainer.outerHTML = summaryTemplate(snapshot);
  },
};

