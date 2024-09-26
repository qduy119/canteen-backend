import { Item, CartItem } from '@/databases/models';
import sequelize from '@/databases/connection';
import { ICartItemService } from './cart-item.service';
import { CartItemUpdateDto } from '@/dto/cart-item/create-item-update.dto';
import { CartItemCreateDto } from '@/dto/cart-item/cart-item-create.dto';
import { IFoodService } from '../food/food.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/container/types';

@injectable()
export default class CartItemService implements ICartItemService {
  constructor(
    @inject(TYPES.FoodService) private readonly itemService: IFoodService
  ) {}

  async getAll(userId: string) {
    const data = await CartItem.findAll({
      where: {
        userId
      },
      include: 'item'
    });
    return data;
  }
  async create(payload: CartItemCreateDto) {
    const t = await sequelize.transaction({ autocommit: false });

    try {
      const { userId, itemId, quantity } = payload;
      const item = await Item.findOne({
        where: { id: itemId },
        lock: t.LOCK.UPDATE,
        transaction: t
      });
      if (item.stock - quantity < 0) {
        throw new Error('Quantity invalid');
      }
      await this.itemService.modifyQuantity(-quantity, itemId, {
        transaction: t
      });
      const isExist = await CartItem.findOne({
        where: { userId, itemId },
        transaction: t
      });
      let data: CartItem;
      if (isExist) {
        isExist.quantity += quantity;
        data = await isExist.save({ transaction: t });
      } else {
        data = await CartItem.create(payload, { transaction: t });
      }

      const result = await CartItem.findOne({
        where: { id: data.id },
        include: 'item',
        transaction: t
      });

      await t.commit();
      return result;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
  async update(id: number, payload: CartItemUpdateDto) {
    const cartItem = await CartItem.findByPk(id);
    const diff = payload.quantity - cartItem.quantity;
    await this.itemService.modifyQuantity(-diff, cartItem.itemId);
    await CartItem.update(payload, { where: { id } });
  }
  async delete(id: number) {
    const cartItem = await CartItem.findByPk(id);
    await this.itemService.modifyQuantity(cartItem.quantity, cartItem.itemId);
    await CartItem.destroy({ where: { id } });
  }
}
