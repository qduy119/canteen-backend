import { CartItem, Order } from '@/databases/models';

export type OrderCreateDto = Partial<Omit<Order, 'id'>> & {
  checkoutItems: CartItem[];
};
