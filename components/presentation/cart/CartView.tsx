"use client";
import React from 'react';
import styles from '../styles/cart.module.css';
import { CartItem, CartState, Totals } from '../../../lib/business/cart/CartTypes';
import { CartSelectors } from '../../../lib/business/cart/CartSelectors';
import CartItemRow from './CartItemRow';
import CartSummary from './CartSummary';

interface CartViewProps {
  state: CartState;
  onToggleItem: (productId: string) => void;
  onToggleAll: (flag: boolean) => void;
  onQtyChange: (productId: string, nextQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onRemoveSelected: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ state, onToggleItem, onToggleAll, onQtyChange, onRemoveItem, onRemoveSelected }) => {
  const totals: Totals = CartSelectors.totals(state);
  const selectedCount = CartSelectors.selectedCount(state);
  const isAllSelected = CartSelectors.isAllSelected(state);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>도매 선적 장바구니</h1>
          <p className={styles.desc}>컨테이너/벌크 물품 장바구니</p>
        </header>

        <main className={styles.grid}>
          <section className={styles.list}>
            {state.items.map((it: CartItem) => {
              const product = state.products.find((p) => p.id === it.productId);
              if (!product) return null;
              return (
                <CartItemRow
                  key={it.productId}
                  product={product}
                  item={it}
                  onToggle={onToggleItem}
                  onQtyChange={onQtyChange}
                  onRemove={onRemoveItem}
                />
              );
            })}
          </section>

          <CartSummary
            totals={totals}
            selectedCount={selectedCount}
            itemCount={state.items.length}
            isAllSelected={isAllSelected}
            onToggleAll={onToggleAll}
            onRemoveSelected={onRemoveSelected}
          />
        </main>
      </div>
    </div>
  );
};

export default CartView;

