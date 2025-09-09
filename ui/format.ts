export function formatKRW(n: number, withSymbol = false): string {
  const formatted = new Intl.NumberFormat('ko-KR').format(n);
  return withSymbol ? `₩${formatted}` : formatted;
}

export function pluralize(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

