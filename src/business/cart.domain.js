// Business domain constants and helpers

export const SHIPPING_THRESHOLD = 50000;
export const SHIPPING_FEE = 3000;

const krwFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
  maximumFractionDigits: 0,
});

export function formatKRW(n) {
  try {
    return krwFormatter.format(Number(n || 0));
  } catch {
    return `₩${Number(n || 0).toLocaleString('ko-KR')}`;
  }
}

