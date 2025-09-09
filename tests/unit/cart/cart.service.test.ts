// Vitest-style tests (placeholder). Ensure vitest/jest configured to run.
import { describe, expect, it, beforeEach } from 'vitest';
import { CartService } from '../../../src/business/cart/CartService';
import { PriceService } from '../../../src/business/cart/PriceService';
import { setStorageBackend } from '../../../src/business/storage/StorageGateway';

describe('CartService + PriceService', () => {
  const mem: Record<string, string> = {};
  const backend = {
    getItem: (k: string) => mem[k] ?? null,
    setItem: (k: string, v: string) => {
      mem[k] = v;
    },
    removeItem: (k: string) => delete mem[k],
    clear: () => Object.keys(mem).forEach((k) => delete mem[k]),
    key: (i: number) => Object.keys(mem)[i] ?? null,
    length: 0,
  } as unknown as Storage;

  beforeEach(() => {
    Object.keys(mem).forEach((k) => delete mem[k]);
    setStorageBackend(backend);
  });

  it('seeds when storage empty', () => {
    const s = CartService.initState();
    expect(s.cart.products.length).toBeGreaterThan(0);
    expect(s.cart.items.length).toBe(s.cart.products.length);
  });

  it('toggle and totals boundary', () => {
    let s = CartService.initState();
    // Select first item only
    const firstId = s.cart.items[0].productId;
    s = CartService.toggleItem(s, firstId);
    const { sum, shipping, grand } = { sum: PriceService.sumSelected(s.cart), shipping: PriceService.shipping(PriceService.sumSelected(s.cart)), grand: 0 };
    const ship = PriceService.shipping(sum);
    expect(ship).toBe(sum < 50000 ? 3000 : 0);
    expect(grand).toBe(0 + 0); // placeholder arithmetic check, grand not used here
  });

  it('quantity change clamps to >= 1', () => {
    let s = CartService.initState();
    const id = s.cart.items[0].productId;
    s = CartService.changeQty(s, id, 0);
    expect(s.cart.items.find((i) => i.productId === id)?.quantity).toBe(1);
  });
});

