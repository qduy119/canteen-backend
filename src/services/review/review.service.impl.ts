import { ReviewCreateDto } from '@/dto/review/review-create.dto';
import { IReviewService } from './review.service';
import { Item, OrderItem, Review } from '@/databases/models';
import { injectable } from 'inversify';

@injectable()
export default class ReviewServiceImpl implements IReviewService {
  async create(payload: ReviewCreateDto): Promise<void> {
    const { rating: reviewRating, orderItemId } = payload;
    await Review.create(payload);
    const { itemId } = await OrderItem.findOne({
      where: { id: orderItemId }
    });
    const { rating } = await Item.findOne({ where: { id: itemId } });
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
    await Item.update(
      { rating: Number((((n - 1) * rating + reviewRating) / n).toFixed(2)) },
      { where: { id: itemId } }
    );
  }
  async isRated(orderItemId: number): Promise<{ isRated: boolean }> {
    const data = await Review.findOne({ where: { orderItemId } });
    return { isRated: Boolean(data) };
  }
}
