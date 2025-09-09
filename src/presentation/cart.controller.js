import { ensureSeed } from "../business/cart.store.js";
import * as actions from "../business/cart.actions.js";
import { CartView as view } from "./cart.view.js";

function getSnapshotAndUpdate() {
  const snapshot = actions.getSnapshot();
  view.update(snapshot);
}

function onSelectAll(e) {
  const checked = e.target.checked;
  actions.toggleSelectAll(checked);
  getSnapshotAndUpdate();
}

function findId(el) {
  const row = el.closest("[data-id]");
  return row ? row.getAttribute("data-id") : undefined;
}

function onSelectItem(e) {
  const id = findId(e.target);
  if (!id) return;
  actions.toggleSelect(id);
  getSnapshotAndUpdate();
}

function onQtyChange(e) {
  const id = findId(e.target);
  if (!id) return;
  const value = e.target.value;
  actions.updateQty(id, value);
  getSnapshotAndUpdate();
}

function onRemove(e) {
  const id = findId(e.target);
  if (!id) return;
  actions.removeItem(id);
  getSnapshotAndUpdate();
}

function onInc(e) {
  const id = findId(e.target);
  if (!id) return;
  actions.incrementQty(id);
  getSnapshotAndUpdate();
}

function onDec(e) {
  const id = findId(e.target);
  if (!id) return;
  actions.decrementQty(id);
  getSnapshotAndUpdate();
}

function bindEvents(root) {
  root.addEventListener("change", (e) => {
    const action = e.target?.dataset?.action;
    if (action === "select-all") return onSelectAll(e);
    if (action === "select") return onSelectItem(e);
    if (action === "qty") return onQtyChange(e);
  });

  root.addEventListener("click", (e) => {
    const el = e.target;
    if (!(el instanceof HTMLElement)) return;
    const action = el.dataset?.action;
    if (action === "inc") return onInc(e);
    if (action === "dec") return onDec(e);
    if (action === "remove") return onRemove(e);
  });
}

export function init() {
  ensureSeed();
  const snapshot = actions.getSnapshot();
  const root = document.querySelector("#app");
  bindEvents(document);
  view.render(snapshot);
}

// Initialize on module load after DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => init());
} else {
  init();
}

