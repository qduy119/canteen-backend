import { Review } from '@/databases/models';

export type ReviewCreateDto = Partial<Omit<Review, 'id'>>;
