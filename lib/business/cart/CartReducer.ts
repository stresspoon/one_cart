"use client";
import { CartAction, CartState, UIState } from './CartTypes';
import { CartService } from './CartService';

export interface CartContextState {
  state: CartState;
  ui: UIState;
}

export const initialCartContextState: CartContextState = {
  state: { products: [], items: [] },
  ui: { selectAll: false },
};

export function CartReducer(prev: CartContextState, action: CartAction): CartContextState {
  switch (action.type) {
    case 'INIT': {
      return CartService.initState();
    }
    case 'TOGGLE_ITEM': {
      return CartService.toggleItem(prev.state, prev.ui, action.productId);
    }
    case 'TOGGLE_ALL': {
      return CartService.toggleAll(prev.state, prev.ui, action.flag);
    }
    case 'CHANGE_QTY': {
      return CartService.changeQty(prev.state, prev.ui, action.productId, action.nextQty);
    }
    case 'REMOVE_ITEM': {
      return CartService.removeItem(prev.state, prev.ui, action.productId);
    }
    case 'REMOVE_SELECTED': {
      return CartService.removeSelected(prev.state, prev.ui);
    }
    default:
      return prev;
  }
}

