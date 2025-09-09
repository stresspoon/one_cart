// Types (informal JSDoc)
// Item: { id:string, name:string, price:number, qty:number, selected:boolean, imageUrl:string }
// Settings: { colors:[string,string,string], version:string }

export const SHIPPING_THRESHOLD = 50000;
export const SHIPPING_FEE = 3000;

export function formatKRW(n, withSymbol = true){
  const s = new Intl.NumberFormat('ko-KR').format(Math.trunc(n || 0));
  return withSymbol ? `₩${s}` : s;
}

