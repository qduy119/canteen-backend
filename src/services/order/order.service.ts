import { Order } from '@/databases/models';
import { OrderCreateDto } from '@/dto/order/order-create.dto';
import { OrderUpdateDto } from '@/dto/order/order-update.dto';
import { PaginationResponse } from '@/dto/pagination';

export interface IOrderService {
  getAll(
    page: number | undefined,
    per_page: number | undefined,
    userId: string,
    role: string
  ): Promise<PaginationResponse<Order>>;
  getById(id: number): Promise<Order>;
  createOrder(payload: OrderCreateDto): Promise<void>;
  update(id: number, payload: OrderUpdateDto): Promise<void>;
  cancelOrder(id: number): Promise<void>;
}
