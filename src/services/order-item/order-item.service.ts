import { OrderItemCreateDto } from '@/dto/order-item/order-item-create.dto';

export interface IOrderItemService {
  create(payload: OrderItemCreateDto): Promise<void>;
}
