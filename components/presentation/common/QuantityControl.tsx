"use client";
import React from 'react';
import styles from '../styles/cart.module.css';

interface QuantityControlProps {
  value: number;
  onChange: (next: number) => void;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({ value, onChange }) => {
  const change = (delta: number) => {
    const next = Math.max(1, Math.floor((value ?? 1) + delta));
    onChange(next);
  };
  const onInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const raw = e.target.value;
    const n = Math.max(1, Math.floor(Number(raw) || 1));
    onChange(n);
  };
  return (
    <div className={styles.qtyControl}>
      <button aria-label="수량 감소" className={styles.qtyBtn} onClick={() => change(-1)}>-</button>
      <input aria-label="수량" className={styles.qtyInput} type="number" value={value} onChange={onInput} min={1} />
      <button aria-label="수량 증가" className={styles.qtyBtn} onClick={() => change(1)}>+</button>
    </div>
  );
};

export default QuantityControl;

