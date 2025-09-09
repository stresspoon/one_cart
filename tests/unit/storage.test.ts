// Framework-neutral unit tests (Jest/Vitest compatible semantics)
// These tests describe seeding and round-trip behavior.

import * as storage from '../../core/storage';

describe('ensureSeed()', () => {
  test('seeds when empty', () => {
    const s = storage.ensureSeed();
    expect(s.items.length).toBeGreaterThanOrEqual(3);
  });

  test('returns same when already present', () => {
    const s1 = storage.ensureSeed();
    const s2 = storage.ensureSeed();
    expect(JSON.stringify(s1)).toBe(JSON.stringify(s2));
  });
});

describe('save/load round-trip', () => {
  test('persists and restores', () => {
    const s1 = storage.ensureSeed();
    const modified = { ...s1, updatedAt: Date.now() + 1 };
    storage.save('cart:state', modified);
    const loaded = storage.load('cart:state');
    expect(JSON.stringify(modified)).toBe(JSON.stringify(loaded));
  });
});

