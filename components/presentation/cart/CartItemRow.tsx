"use client";
import React from 'react';
import Image from 'next/image';
import styles from '../styles/cart.module.css';
import { CartItem, Product } from '../../../lib/business/cart/CartTypes';
import QuantityControl from '../common/QuantityControl';

interface CartItemRowProps {
  product: Product;
  item: CartItem;
  onToggle: (productId: string) => void;
  onQtyChange: (productId: string, nextQty: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ product, item, onToggle, onQtyChange, onRemove }) => {
  const checkboxId = `chk-${product.id}`;
  return (
    <div className={styles.row}>
      <div className={styles.checkboxWrap}>
        <input id={checkboxId} className={styles.checkbox} type="checkbox" checked={item.selected} onChange={() => onToggle(product.id)} />
      </div>
      <div className={styles.thumbBox}>
        <Image src={product.imageUrl} alt={product.title} fill sizes="96px" style={{ objectFit: 'cover' }} />
      </div>
      <div className={styles.info}>
        <label htmlFor={checkboxId} className={styles.titleClamp}>{product.title}</label>
        <div className={styles.unitPrice}>{(product.unitPrice).toLocaleString('ko-KR')}원</div>
      </div>
      <div className={styles.qtyArea}>
        <QuantityControl value={item.quantity} onChange={(n) => onQtyChange(product.id, n)} />
      </div>
      <button className={styles.removeBtn} onClick={() => onRemove(product.id)}>삭제</button>
    </div>
  );
};

export default CartItemRow;

