import { Category } from '@/databases/models';

export type CategoryCreateDto = Partial<Omit<Category, 'id'>>;
