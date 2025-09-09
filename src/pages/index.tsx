import React from 'react';
import { CartReducer } from '../business/cart/CartReducer';
import { CartService } from '../business/cart/CartService';
import type { CombinedState } from '../business/cart/CartTypes';
import { CartSelectors } from '../business/cart/CartSelectors';
import { PriceService } from '../business/cart/PriceService';
import CartView from '../presentation/cart/CartView';

function initState(): CombinedState {
  if (typeof window === 'undefined') {
    // SSR guard: return empty shell; client will re-hydrate via useEffect dispatch INIT
    return { cart: { products: [], items: [] }, ui: { selectAll: false } };
  }
  return CartService.initState();
}

export const CartPage: React.FC = () => {
  const [state, dispatch] = React.useReducer(CartReducer, undefined as unknown as CombinedState, initState);

  React.useEffect(() => {
    if (state.cart.products.length === 0 && typeof window !== 'undefined') {
      const s = CartService.initState();
      dispatch({ type: 'INIT', payload: s });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { sum, shipping, grand } = CartSelectors.totals(state);
  const selectedCount = CartSelectors.selectedCount(state);
  const allSelected = CartSelectors.isAllSelected(state);

  const sumFmt = PriceService.formatKRW(sum);
  const shipFmt = PriceService.formatKRW(shipping);
  const grandFmt = PriceService.formatKRW(grand);

  const onToggleItem = (productId: string) => dispatch({ type: 'TOGGLE_ITEM', payload: { productId } });
  const onToggleAll = (flag: boolean) => dispatch({ type: 'TOGGLE_ALL', payload: { flag } });
  const onQtyChange = (productId: string, quantity: number) =>
    dispatch({ type: 'CHANGE_QTY', payload: { productId, quantity } });
  const onRemoveItem = (productId: string) => dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  const onRemoveSelected = () => dispatch({ type: 'REMOVE_SELECTED' });

  return (
    <CartView
      products={state.cart.products}
      items={state.cart.items}
      allSelected={allSelected}
      selectedCount={selectedCount}
      sumFormatted={sumFmt}
      shippingFormatted={shipFmt}
      grandFormatted={grandFmt}
      onToggleItem={onToggleItem}
      onToggleAll={onToggleAll}
      onQtyChange={onQtyChange}
      onRemoveItem={onRemoveItem}
      onRemoveSelected={onRemoveSelected}
    />
  );
};

export default CartPage;

