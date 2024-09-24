import { Order } from '@/databases/models';

export type OrderUpdateDto = Partial<Omit<Order, 'id'>>;
