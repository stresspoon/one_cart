import React from 'react';
import type { CartItem, Product } from '../../business/cart/CartTypes';
import CartItemRow from './CartItemRow';
import CartSummary from './CartSummary';
import '../styles/cart.css';

type Props = {
  products: Product[];
  items: CartItem[];
  allSelected: boolean;
  selectedCount: number;
  sumFormatted: string;
  shippingFormatted: string;
  grandFormatted: string;
  onToggleItem: (productId: string) => void;
  onToggleAll: (flag: boolean) => void;
  onQtyChange: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onRemoveSelected: () => void;
};

export const CartView: React.FC<Props> = ({
  products,
  items,
  allSelected,
  selectedCount,
  sumFormatted,
  shippingFormatted,
  grandFormatted,
  onToggleItem,
  onToggleAll,
  onQtyChange,
  onRemoveItem,
  onRemoveSelected,
}) => {
  // Map for quick lookup
  const productMap = React.useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  return (
    <main className="cart">
      <header className="cart__header">
        <h1>장바구니</h1>
        <p className="muted">컨테이너 해상운송 도매 상품 장바구니</p>
      </header>

      <section className="cart__content" aria-label="상품 목록">
        <div className="cart-table" role="grid" aria-rowcount={items.length}>
          {items.map((item) => {
            const product = productMap.get(item.productId);
            if (!product) return null;
            return (
              <CartItemRow
                key={item.productId}
                product={product}
                item={item}
                onToggle={onToggleItem}
                onQtyChange={onQtyChange}
                onRemove={onRemoveItem}
              />
            );
          })}
        </div>
      </section>

      <CartSummary
        selectedCount={selectedCount}
        sumFormatted={sumFormatted}
        shippingFormatted={shippingFormatted}
        grandFormatted={grandFormatted}
        allSelected={allSelected}
        onToggleAll={onToggleAll}
        onRemoveSelected={onRemoveSelected}
      />

      <footer className="cart__footer">
        <small className="muted">가격은 KRW 표시, 부가세 별도일 수 있음.</small>
      </footer>
    </main>
  );
};

export default CartView;

