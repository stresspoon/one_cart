// Domain constants and helpers
export const SHIPPING_THRESHOLD = 50000;
export const SHIPPING_FEE = 3000;

export function formatKRW(n) {
  try {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(n || 0);
  } catch {
    // Fallback formatting
    return `${(n || 0).toLocaleString('ko-KR')}원`;
  }
}

