"use client";
import React from 'react';
import styles from '../styles/cart.module.css';
import { Totals } from '../../../lib/business/cart/CartTypes';
import { PriceService } from '../../../lib/business/cart/PriceService';

interface CartSummaryProps {
  totals: Totals;
  selectedCount: number;
  itemCount: number;
  isAllSelected: boolean;
  onToggleAll: (flag: boolean) => void;
  onRemoveSelected: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ totals, selectedCount, itemCount, isAllSelected, onToggleAll, onRemoveSelected }) => {
  return (
    <aside className={styles.summaryPanel} aria-live="polite">
      <div className={styles.actions}>
        <label>
          <input type="checkbox" checked={isAllSelected} onChange={(e) => onToggleAll(e.target.checked)} /> 전체 선택
        </label>
        <button className={styles.btn} onClick={onRemoveSelected} disabled={selectedCount === 0}>선택 삭제</button>
      </div>

      <div className={styles.summaryRow}><span>선택 합계</span><strong>{PriceService.formatKRW(totals.selectedSum)}</strong></div>
      <div className={styles.summaryRow}><span>배송비</span><strong>{PriceService.formatKRW(totals.shippingFee)}</strong></div>
      <div className={styles.summaryRow + ' ' + styles.summaryTotal}><span>총액</span><strong>{PriceService.formatKRW(totals.grandTotal)}</strong></div>

      <button className={styles.btn + ' ' + styles.btnAccent} disabled={selectedCount === 0}>결제(더미)</button>

      <div className={styles.footerBar}>
        <div className={styles.summaryRow}><span>총액</span><strong>{PriceService.formatKRW(totals.grandTotal)}</strong></div>
      </div>
      <div className={styles.srOnly} aria-live="polite">선택 {selectedCount}개 / 전체 {itemCount}개</div>
    </aside>
  );
};

export default CartSummary;

