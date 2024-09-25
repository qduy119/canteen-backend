import { Item, Order, OrderItem, Payment } from '@/databases/models';
import { OrderCreateDto } from '@/dto/order/order-create.dto';
import { OrderUpdateDto } from '@/dto/order/order-update.dto';
import { PaginationResponse } from '@/dto/pagination';
import { IOrderService } from './order.service';
import { IOrderItemService } from '../order-item/order-item.service';
import { ICartItemService } from '../cart-item/cart-item.service';
import { ISeatReservationService } from '../seat-reservation/seat-reservation.service';
import { ICouponService } from '../coupon/coupon.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/container/types';

@injectable()
export default class OrderServiceImpl implements IOrderService {
  constructor(
    @inject(TYPES.OrderItemService)
    private readonly orderItemService: IOrderItemService,
    @inject(TYPES.CartItemService)
    private readonly cartItemService: ICartItemService,
    @inject(TYPES.CouponService) private readonly couponService: ICouponService,
    @inject(TYPES.SeatReservationService)
    private readonly seatReservationService: ISeatReservationService
  ) {}

  async getAll(
    page: number | undefined,
    per_page: number | undefined,
    userId: string,
    role: string
  ): Promise<PaginationResponse<Order>> {
    type Condition = { userId: string };
    let condition: Condition = {} as Condition;
    if (userId) condition.userId = userId;
    if (role === 'Admin') condition = {} as Condition;

    const { rows: data, count } = await Order.findAndCountAll({
      where: condition,
      offset: (+page - 1) * +per_page,
      limit: +per_page,
      order: [['orderDate', 'DESC']],
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{ model: Item, as: 'item' }]
        },
        {
          model: Payment,
          as: 'payment'
        }
      ],
      distinct: true
    });
    const total_pages = Math.ceil(count / Number(per_page));
    return { data, total_pages };
  }
  async getById(id: number): Promise<Order> {
    const data = await Order.findByPk(id);
    return data;
  }
  async createOrder(payload: OrderCreateDto): Promise<void> {
    const { couponCode, seatNumber, userId, checkoutItems } = payload;
    const order = await Order.create(payload);
    const orderId = order.id;

    const orderItemPromises = checkoutItems.map(async (item) => {
      const price =
        item.item.price * (1 - item.item.discount * 0.01) * item.quantity;
      const payload = {
        itemId: item.item.id,
        orderId,
        quantity: item.quantity,
        price: Number(price.toFixed(2))
      };
      await this.orderItemService.create(payload);
    });
    await Promise.all(orderItemPromises);

    const cartItems = await this.cartItemService.getAll(userId);

    const cartItemPromises = checkoutItems.map(async (item) => {
      const found = cartItems.find((cartItem) => cartItem.id == item.id);
      if (item.quantity === found.quantity) {
        await this.cartItemService.delete(found.id);
      } else if (item.quantity < found.quantity) {
        await this.cartItemService.update(found.id, {
          quantity: found.quantity - item.quantity
        });
      }
    });
    await Promise.all(cartItemPromises);

    if (couponCode) {
      await this.couponService.modifyUsedQuantity(1, couponCode);
    }
    if (seatNumber) {
      await this.seatReservationService.create({ seatNumber, orderId });
    }
  }
  async update(id: number, payload: OrderUpdateDto): Promise<void> {
    await Order.update(payload, { where: { id } });
  }
  async cancelOrder(id: number): Promise<void> {
    await Order.update({ status: 'Cancel' }, { where: { id } });
    const order = await Order.findOne({
      where: {
        id
      },
      include: 'orderItems'
    });
    if (order.seatNumber) {
      await this.seatReservationService.delete({
        seatNumber: order.seatNumber,
        orderId: order.id
      });
    }
    if (order.couponCode) {
      await this.couponService.modifyUsedQuantity(-1, order.couponCode);
    }
    for (const orderItem of order.orderItems) {
      await Item.increment(
        { stock: orderItem.quantity },
        { where: { id: orderItem.itemId } }
      );
    }
  }
}
