import React from 'react';
import type { CartItem, Product } from '../../business/cart/CartTypes';
import QuantityControl from '../common/QuantityControl';

type Props = {
  product: Product;
  item: CartItem;
  onToggle: (productId: string) => void;
  onQtyChange: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
};

export const CartItemRow: React.FC<Props> = ({ product, item, onToggle, onQtyChange, onRemove }) => {
  const checkboxId = `sel-${product.id}`;
  return (
    <div className="cart-row" role="row">
      <div className="cart-row__select" role="gridcell">
        <input
          id={checkboxId}
          type="checkbox"
          checked={item.selected}
          onChange={() => onToggle(product.id)}
        />
        <label htmlFor={checkboxId} className="visually-hidden">
          {product.title} 선택
        </label>
      </div>
      <div className="cart-row__thumb" role="gridcell">
        {/* Decorative elements should not intercept clicks */}
        <img src={product.imageUrl} alt="" aria-hidden="true" draggable={false} />
      </div>
      <div className="cart-row__title" role="gridcell">
        <div className="title" title={product.title}>
          {product.title}
        </div>
        <div className="sku">SKU: {product.sku}</div>
      </div>
      <div className="cart-row__price" role="gridcell">
        ₩{product.unitPrice.toLocaleString('ko-KR')}
      </div>
      <div className="cart-row__qty" role="gridcell">
        <QuantityControl value={item.quantity} onChange={(n) => onQtyChange(product.id, n)} />
      </div>
      <div className="cart-row__actions" role="gridcell">
        <button type="button" className="btn btn--text" onClick={() => onRemove(product.id)}>
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;

