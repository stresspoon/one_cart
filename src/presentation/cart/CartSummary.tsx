import React from 'react';

type Props = {
  selectedCount: number;
  sumFormatted: string;
  shippingFormatted: string;
  grandFormatted: string;
  allSelected: boolean;
  onToggleAll: (flag: boolean) => void;
  onRemoveSelected: () => void;
};

export const CartSummary: React.FC<Props> = ({
  selectedCount,
  sumFormatted,
  shippingFormatted,
  grandFormatted,
  allSelected,
  onToggleAll,
  onRemoveSelected,
}) => {
  return (
    <aside className="cart-summary" aria-label="장바구니 합계">
      <div className="cart-summary__controls">
        <label className="chk-all">
          <input type="checkbox" checked={allSelected} onChange={(e) => onToggleAll(e.target.checked)} /> 전체 선택
        </label>
        <button type="button" className="btn btn--danger" onClick={onRemoveSelected} disabled={selectedCount === 0}>
          선택 삭제 ({selectedCount})
        </button>
      </div>

      <div className="card">
        <div className="card__row">
          <span>선택 합계</span>
          <strong>{sumFormatted}</strong>
        </div>
        <div className="card__row">
          <span>배송비</span>
          <strong>{shippingFormatted}</strong>
        </div>
        <div className="card__row card__row--total" aria-live="polite">
          <span>총 결제금액</span>
          <strong>{grandFormatted}</strong>
        </div>
        <button type="button" className="btn btn--primary btn--block" disabled={selectedCount === 0}>
          결제 진행
        </button>
      </div>
    </aside>
  );
};

export default CartSummary;

