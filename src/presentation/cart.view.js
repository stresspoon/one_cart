import { formatKRW } from "../business/cart.domain.js";

const SELECTORS = {
  root: "#app",
};

function itemCard(item) {
  return `
    <article class="row" data-id="${item.id}">
      <div class="thumb">
        <img src="${item.imageUrl}" alt="${item.name}" loading="lazy" />
      </div>
      <div class="info">
        <h3>${item.name}</h3>
        <p class="desc">${item.desc || ""}</p>
        <div class="price">${formatKRW(item.price)}</div>
      </div>
      <div class="actions">
        <label aria-label="상품 선택">
          <input type="checkbox" data-action="select" ${item.selected ? "checked" : ""} />
        </label>
        <div class="qty-group" aria-label="수량 조절">
          <button type="button" class="btn" data-action="dec" aria-label="수량 감소">–</button>
          <input type="number" min="1" value="${item.qty}" data-action="qty" aria-label="수량 입력" />
          <button type="button" class="btn" data-action="inc" aria-label="수량 증가">+</button>
        </div>
        <span class="spacer" aria-hidden="true"></span>
        <button type="button" class="btn btn-danger" data-action="remove" aria-label="상품 삭제">삭제</button>
      </div>
    </article>
  `;
}

function summaryPanel(snapshot) {
  return `
    <section class="summary" role="status" aria-live="polite">
      <h4>주문 요약</h4>
      <div class="row"><div class="muted">선택 합계</div><div>${formatKRW(snapshot.sum)}</div></div>
      <div class="row"><div class="muted">배송비</div><div>${formatKRW(snapshot.shipping)}</div></div>
      <hr />
      <div class="row"><div class="header-title">총액</div><div class="total">${formatKRW(snapshot.total)}</div></div>
    </section>
  `;
}

function listHeader(allSelected) {
  return `
    <header class="cart-header">
      <label><input type="checkbox" data-action="select-all" ${allSelected ? "checked" : ""} /> 전체 선택</label>
    </header>
  `;
}

export const CartView = {
  render(snapshot) {
    const root = document.querySelector(SELECTORS.root);
    if (!root) return;

    root.innerHTML = `
      <div class="layout">
        <main>
          ${listHeader(snapshot.allSelected)}
          <section class="cart-grid">
            ${snapshot.items.map(itemCard).join("")}
          </section>
        </main>
        ${summaryPanel(snapshot)}
      </div>
    `;
  },

  update(snapshot) {
    // Minimal: re-render to keep DOM simple while using delegated events
    this.render(snapshot);
  },
};

