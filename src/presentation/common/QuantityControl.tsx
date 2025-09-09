import React from 'react';

type Props = {
  value: number;
  min?: number;
  onChange: (next: number) => void;
};

export const QuantityControl: React.FC<Props> = ({ value, min = 1, onChange }) => {
  const dec = () => onChange(Math.max(min, (value || min) - 1));
  const inc = () => onChange(Math.max(min, (value || min) + 1));
  const onInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const n = parseInt(e.target.value.replace(/\D+/g, ''), 10);
    onChange(Number.isFinite(n) ? Math.max(min, n) : min);
  };
  return (
    <div className="qty">
      <button type="button" className="qty__btn" aria-label="수량 감소" onClick={dec}>
        −
      </button>
      <input className="qty__input" inputMode="numeric" pattern="[0-9]*" value={value} onChange={onInput} />
      <button type="button" className="qty__btn" aria-label="수량 증가" onClick={inc}>
        +
      </button>
    </div>
  );
};

export default QuantityControl;

