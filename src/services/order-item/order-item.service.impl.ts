import { OrderItem } from '@/databases/models';
import { OrderItemCreateDto } from '@/dto/order-item/order-item-create.dto';
import { IOrderItemService } from './order-item.service';

export default class OrderItemServiceImpl implements IOrderItemService {
  async create(payload: OrderItemCreateDto): Promise<void> {
    await OrderItem.create(payload);
  }
}
