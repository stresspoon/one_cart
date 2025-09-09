import { PriceService } from '../../../lib/business/cart/PriceService';

describe('PriceService', () => {
  test('shipping boundary', () => {
    expect(PriceService.shipping(49_999)).toBe(3_000);
    expect(PriceService.shipping(50_000)).toBe(0);
  });

  test('formatKRW', () => {
    const s = PriceService.formatKRW(1234567);
    expect(s).toMatch(/₩|원/);
  });
});

