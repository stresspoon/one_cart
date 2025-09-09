export function formatKRW(n: number, withSymbol = false): string {
  const nf = new Intl.NumberFormat('ko-KR');
  const s = nf.format(Math.trunc(n || 0));
  return withSymbol ? `₩${s}` : s;
}

export function pluralize(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

