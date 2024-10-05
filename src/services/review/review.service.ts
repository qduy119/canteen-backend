import { Review } from '@/databases/models';
import { ReviewCreateDto } from '@/dto/review/review-create.dto';
import { IFoodService } from '../food/food.service';

export interface IReviewService {
  setFoodDependencyInstance(service: IFoodService): void;
  getByItemId(id: number): Promise<Review[]>;
  create(payload: ReviewCreateDto): Promise<void>;
  isRated(orderItemId: number): Promise<{ isRated: boolean }>;
}

export type FactoryOfReviewService = (parent: IFoodService) => IReviewService;
