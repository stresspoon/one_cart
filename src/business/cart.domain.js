// Business domain: constants, schemas, helpers (no side effects)

// Item schema (for reference):
// {
//   id: string,
//   name: string,
//   price: number,    // per unit in KRW
//   qty: number,      // integer >= 1
//   selected: boolean,
//   imageUrl: string
// }

export const SHIPPING_THRESHOLD = 50000;
export const SHIPPING_FEE = 3000;

export function formatKRW(n) {
  try {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(n);
  } catch (_) {
    // Fallback formatting
    return `₩${(n ?? 0).toLocaleString('ko-KR')}`;
  }
}

