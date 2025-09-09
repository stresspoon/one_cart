import { CartReducer, initialCartContextState } from '../../../lib/business/cart/CartReducer';
import { StorageGateway } from '../../../lib/business/storage/StorageGateway';

describe('CartReducer', () => {
  beforeEach(() => {
    StorageGateway.__memoryReset();
    StorageGateway.clearAll();
  });

  test('INIT loads or seeds', () => {
    const next = CartReducer(initialCartContextState, { type: 'INIT' });
    expect(next.state.products.length).toBeGreaterThan(0);
  });
});

