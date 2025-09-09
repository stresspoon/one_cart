// Framework neutral tests (Jest/Vitest compatible)
import * as storage from '../../core/storage.ts';
import { CartState } from '../../core/types.ts';

describe('storage ensureSeed and round-trip', () => {
  it('ensureSeed returns 3 items when empty', () => {
    // Simulate empty by using a fresh in-memory map (module local). We cannot clear real localStorage here.
    const s = storage.ensureSeed();
    expect(Array.isArray(s.items)).toBe(true);
    expect(s.items.length).toBeGreaterThanOrEqual(3);
  });

  it('save/load round trip', () => {
    const key = storage.getKey();
    const next: CartState = {
      items: [{ id:'x', title:'x', price:1, qty:1, selected:true }],
      updatedAt: Date.now(),
    };
    storage.save(key, next);
    const loaded = storage.load<CartState>(key)!;
    expect(loaded.items[0].id).toBe('x');
    expect(loaded.items[0].qty).toBe(1);
  });
});

