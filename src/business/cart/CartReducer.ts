import type { CartAction, CombinedState } from './CartTypes';
import { CartService } from './CartService';

export function CartReducer(state: CombinedState, action: CartAction): CombinedState {
  switch (action.type) {
    case 'INIT':
      return action.payload;
    case 'TOGGLE_ITEM':
      return CartService.toggleItem(state, action.payload.productId);
    case 'TOGGLE_ALL':
      return CartService.toggleAll(state, action.payload.flag);
    case 'CHANGE_QTY':
      return CartService.changeQty(state, action.payload.productId, action.payload.quantity);
    case 'REMOVE_ITEM':
      return CartService.removeItem(state, action.payload.productId);
    case 'REMOVE_SELECTED':
      return CartService.removeSelected(state);
    default:
      return state;
  }
}

