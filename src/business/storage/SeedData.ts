import { Product, CartItem, CartState, UIState } from '../cart/CartTypes';

export const seedProducts: Product[] = [
  {
    id: 'p-20ft',
    sku: '20FT-DRY-A',
    title: '20ft Dry Container (Grade A)',
    unitPrice: 2_000_000,
    imageUrl: '/img/20ft-dry.jpg',
    description: '표준 드라이 컨테이너',
    unit: 'unit',
  },
  {
    id: 'p-40hc',
    sku: '40FT-HC',
    title: '40ft High Cube Container',
    unitPrice: 3_500_000,
    imageUrl: '/img/40ft-hc.jpg',
    description: '하이큐브',
    unit: 'unit',
  },
  {
    id: 'p-reefer',
    sku: 'REEFER-U',
    title: 'Reefer Unit (냉동 컨테이너)',
    unitPrice: 4_800_000,
    imageUrl: '/img/reefer.jpg',
    description: '냉동/냉장',
    unit: 'unit',
  },
  {
    id: 'p-coffee',
    sku: 'COFFEE-PAL-1T',
    title: 'Bulk Coffee Beans Pallet (1톤)',
    unitPrice: 1_200_000,
    imageUrl: '/img/coffee-pallet.jpg',
    description: '팔레트',
    unit: 'pallet',
  },
  {
    id: 'p-steel',
    sku: 'STEEL-COILS',
    title: 'Steel Coils (컨테이너 적합 규격)',
    unitPrice: 2_800_000,
    imageUrl: '/img/steel-coils.jpg',
    description: '코일 번들',
    unit: 'bundle',
  },
  {
    id: 'p-pvc',
    sku: 'PVC-PEL-25x40',
    title: 'PVC Pellets 25kg x 40 Bags',
    unitPrice: 900_000,
    imageUrl: '/img/pvc-pellets.jpg',
    description: '벌크 포장',
    unit: 'lot',
  },
];

export function seedItems(products: Product[]): CartItem[] {
  return products.map((p) => ({ productId: p.id, quantity: 1, selected: false }));
}

export function seedCartState(): CartState {
  const products = seedProducts;
  return { products, items: seedItems(products) };
}

export function seedUIState(): UIState {
  return { selectAll: false };
}

