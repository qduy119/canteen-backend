import { ReviewCreateDto } from '@/dto/review/review-create.dto';

export interface IReviewService {
  create(payload: ReviewCreateDto): Promise<void>;
  isRated(orderItemId: number): Promise<{ isRated: boolean }>;
}
