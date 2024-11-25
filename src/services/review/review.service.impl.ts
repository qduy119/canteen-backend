import { ReviewCreateDto } from '@/dto/review/review-create.dto';
import { IReviewService } from './review.service';
import { OrderItem, Review, User } from '@/databases/models';
import { injectable } from 'inversify';
import { IFoodService } from '../food/food.service';
import { client } from '@/utils';

@injectable()
export default class ReviewServiceImpl implements IReviewService {
  private foodService: IFoodService;

  setFoodDependencyInstance(service: IFoodService) {
    this.foodService = service;
  }

  async getByItemId(itemId: number): Promise<Review[]> {
    const data = await Review.findAll({
      include: [
        {
          model: OrderItem,
          where: {
            itemId
          }
        },
        {
          model: User,
          as: 'user'
        }
      ],
      order: [['createAt', 'DESC']]
    });

    return data;
  }
  async create(payload: ReviewCreateDto): Promise<void> {
    const { rating: reviewRating, orderItemId } = payload;
    await Review.create(payload);
    if (client.isReady) {
      await client.set(`rated:${orderItemId}`, 1, { EX: 300 });
    }

    const { itemId } = await OrderItem.findOne({
      where: { id: orderItemId }
    });
    const {
      data: { rating }
    } = await this.foodService.getById(itemId);

    const n = await Review.count({
      include: [
        {
          model: OrderItem,
          where: {
            itemId
          }
        }
      ]
    });

    await this.foodService.update(itemId, {
      rating: Number((((n - 1) * rating + Number(reviewRating)) / n).toFixed(2))
    });
  }
  async isRated(orderItemId: number): Promise<{ isRated: boolean }> {
    if (client.isReady) {
      const rated = await client.exists(`rated:${orderItemId}`);
      if (rated) {
        return {
          isRated: Boolean(Number(await client.get(`rated:${orderItemId}`)))
        };
      }
    }
    const data = await Review.findOne({ where: { orderItemId } });
    if (client.isReady) {
      await client.set(`rated:${orderItemId}`, data ? 1 : 0, {
        EX: 300,
        NX: true
      });
      return {
        isRated: Boolean(Number(await client.get(`rated:${orderItemId}`)))
      };
    }
  }
}
