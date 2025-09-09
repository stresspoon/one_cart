import { CartService } from '../../../lib/business/cart/CartService';
import { StorageGateway } from '../../../lib/business/storage/StorageGateway';

describe('CartService', () => {
  beforeEach(() => {
    StorageGateway.__memoryReset();
    StorageGateway.clearAll();
  });

  test('initState seeds when empty', () => {
    const { state, ui } = CartService.initState();
    expect(state.products.length).toBeGreaterThan(0);
    expect(state.items.length).toBe(state.products.length);
    expect(ui.selectAll).toBe(false);
  });

  test('toggleItem updates selection and selectAll', () => {
    let ctx = CartService.initState();
    const firstId = ctx.state.items[0].productId;
    ctx = CartService.toggleItem(ctx.state, ctx.ui, firstId);
    const toggled = ctx.state.items.find((i) => i.productId === firstId)!;
    expect(toggled.selected).toBe(true);
    expect(ctx.ui.selectAll).toBe(false);
  });

  test('toggleAll true/false', () => {
    let ctx = CartService.initState();
    ctx = CartService.toggleAll(ctx.state, ctx.ui, true);
    expect(ctx.state.items.every((i) => i.selected)).toBe(true);
    expect(ctx.ui.selectAll).toBe(true);
    ctx = CartService.toggleAll(ctx.state, ctx.ui, false);
    expect(ctx.state.items.every((i) => !i.selected)).toBe(true);
    expect(ctx.ui.selectAll).toBe(false);
  });

  test('changeQty clamps and persists', () => {
    let ctx = CartService.initState();
    const id = ctx.state.items[0].productId;
    ctx = CartService.changeQty(ctx.state, ctx.ui, id, 0);
    expect(ctx.state.items.find((i) => i.productId === id)!.quantity).toBe(1);
    ctx = CartService.changeQty(ctx.state, ctx.ui, id, 5);
    expect(ctx.state.items.find((i) => i.productId === id)!.quantity).toBe(5);
  });

  test('removeItem and removeSelected', () => {
    let ctx = CartService.initState();
    const id = ctx.state.items[0].productId;
    ctx = CartService.removeItem(ctx.state, ctx.ui, id);
    expect(ctx.state.items.find((i) => i.productId === id)).toBeUndefined();

    // select all then remove selected
    ctx = CartService.toggleAll(ctx.state, ctx.ui, true);
    ctx = CartService.removeSelected(ctx.state, ctx.ui);
    expect(ctx.state.items.length).toBe(0);
    expect(ctx.ui.selectAll).toBe(false);
  });
});

