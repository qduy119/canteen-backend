import { Review } from '@/databases/models';
import { ReviewCreateDto } from '@/dto/review/review-create.dto';

export interface IReviewService {
  getByItemId(id: number): Promise<Review[]>
  create(payload: ReviewCreateDto): Promise<void>;
  isRated(orderItemId: number): Promise<{ isRated: boolean }>;
}
