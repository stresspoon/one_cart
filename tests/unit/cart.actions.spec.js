// Unit tests for cart.actions.js with mocked store
import * as actions from "../../src/business/cart.actions.js";

// Simple in-memory mock for localStorage-backed store
const memory = { items: [], settings: {} };

// Mock store module by monkey-patching its functions via globalThis
import * as store from "../../src/business/cart.store.js";

store.getItems = () => memory.items;
store.setItems = (items) => { memory.items = items; };

function reset(items) {
  memory.items = items.map((x) => ({ ...x }));
}

function test(name, fn) { try { fn(); console.log("✓", name); } catch (e) { console.error("✗", name, "\n", e); } }

test("수량 정규화: NaN, 0, 음수 → 1", () => {
  reset([{ id: "a", qty: 2, price: 1000, selected: true }]);
  actions.updateQty("a", "foo");
  console.assert(memory.items[0].qty === 1, "NaN → 1");
  actions.updateQty("a", 0);
  console.assert(memory.items[0].qty === 1, "0 → 1");
  actions.updateQty("a", -5);
  console.assert(memory.items[0].qty === 1, "-5 → 1");
});

test("전체선택 토글", () => {
  reset([
    { id: "a", qty: 1, price: 1000, selected: false },
    { id: "b", qty: 1, price: 2000, selected: true },
  ]);
  actions.toggleSelectAll(true);
  console.assert(memory.items.every((i) => i.selected), "all selected");
  actions.toggleSelectAll(false);
  console.assert(memory.items.every((i) => !i.selected), "all unselected");
});

test("삭제 동작", () => {
  reset([
    { id: "a", qty: 1, price: 1000, selected: true },
    { id: "b", qty: 1, price: 2000, selected: true },
  ]);
  actions.removeItem("a");
  console.assert(memory.items.length === 1 && memory.items[0].id === "b", "removed a");
});

test("스냅샷 계산", () => {
  reset([
    { id: "a", qty: 1, price: 49000, selected: true },
    { id: "b", qty: 1, price: 2000, selected: false },
  ]);
  const snap = actions.getSnapshot();
  console.assert(snap.sum === 49000, "sum selected only");
  console.assert(snap.shipping === 3000, "shipping under threshold");
  console.assert(snap.total === 52000, "grand total");
  console.assert(snap.allSelected === false && snap.anySelected === true, "flags");
});

