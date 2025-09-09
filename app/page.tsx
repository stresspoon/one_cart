"use client";
import React from 'react';
import CartView from '../components/presentation/cart/CartView';
import { CartReducer, initialCartContextState } from '../lib/business/cart/CartReducer';

export default function Page() {
  const [ctx, dispatch] = React.useReducer(CartReducer, initialCartContextState);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    dispatch({ type: 'INIT' });
  }, []);

  if (!mounted) {
    return (
      <div style={{ padding: 24 }}>로딩 중...</div>
    );
  }

  return (
    <CartView
      state={ctx.state}
      onToggleItem={(productId) => dispatch({ type: 'TOGGLE_ITEM', productId })}
      onToggleAll={(flag) => dispatch({ type: 'TOGGLE_ALL', flag })}
      onQtyChange={(productId, nextQty) => dispatch({ type: 'CHANGE_QTY', productId, nextQty })}
      onRemoveItem={(productId) => dispatch({ type: 'REMOVE_ITEM', productId })}
      onRemoveSelected={() => dispatch({ type: 'REMOVE_SELECTED' })}
    />
  );
}

