import { Product, CartItem, UIState } from '../cart/CartTypes';

export const seedProducts: Product[] = [
  {
    id: 'p-20ft-dry',
    sku: 'CNT-20-DRY-A',
    title: '20ft Dry Container (Grade A)',
    unitPrice: 2_000_000,
    imageUrl: '/img/20ft-dry.jpg',
    unit: 'ea',
  },
  {
    id: 'p-40ft-hc',
    sku: 'CNT-40-HC',
    title: '40ft High Cube Container',
    unitPrice: 3_500_000,
    imageUrl: '/img/40ft-hc.jpg',
    unit: 'ea',
  },
  {
    id: 'p-reefer',
    sku: 'CNT-REEFER',
    title: 'Reefer Unit(냉동 컨테이너)',
    unitPrice: 4_800_000,
    imageUrl: '/img/reefer.jpg',
    unit: 'ea',
  },
  {
    id: 'p-coffee-pallet',
    sku: 'BLK-COFFEE-1T',
    title: 'Bulk Coffee Beans Pallet(1t)',
    unitPrice: 1_200_000,
    imageUrl: '/img/coffee-pallet.jpg',
    unit: '1t',
  },
  {
    id: 'p-steel-coils',
    sku: 'STL-COIL-ISO',
    title: 'Steel Coils(컨테이너 규격)',
    unitPrice: 2_800_000,
    imageUrl: '/img/steel-coils.jpg',
    unit: 'set',
  },
  {
    id: 'p-pvc-pellets',
    sku: 'PVC-25KGx40',
    title: 'PVC Pellets 25kg x 40',
    unitPrice: 900_000,
    imageUrl: '/img/pvc-pellets.jpg',
    unit: 'pallet',
  },
];

export const seedItems: CartItem[] = seedProducts.map((p) => ({
  productId: p.id,
  quantity: 1,
  selected: false,
}));

export const seedUI: UIState = { selectAll: false };

