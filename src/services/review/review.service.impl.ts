import { ReviewCreateDto } from '@/dto/review/review-create.dto';
import { IReviewService } from './review.service';
import { OrderItem, Review, User } from '@/databases/models';
import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import { IFoodService } from '../food/food.service';
import { TYPES } from '@/container/types';

@injectable()
export default class ReviewServiceImpl implements IReviewService {
  constructor(
    @inject(new LazyServiceIdentifer(() => TYPES.FoodService))
    private readonly foodService: IFoodService
  ) {}

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
    const data = await Review.findOne({ where: { orderItemId } });
    return { isRated: Boolean(data) };
  }
}