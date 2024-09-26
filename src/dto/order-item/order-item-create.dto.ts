import { OrderItem } from '@/databases/models';

export type OrderItemCreateDto = Partial<Omit<OrderItem, 'id'>>;
