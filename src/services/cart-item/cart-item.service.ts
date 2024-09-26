import { CartItem } from '@/databases/models';
import { CartItemCreateDto } from '@/dto/cart-item/cart-item-create.dto';
import { CartItemUpdateDto } from '@/dto/cart-item/create-item-update.dto';

export interface ICartItemService {
  getAll(userId: string): Promise<CartItem[]>;
  create(payload: CartItemCreateDto): Promise<CartItem>;
  update(id: number, payload: CartItemUpdateDto): Promise<void>;
  delete(id: number): Promise<void>;
}
