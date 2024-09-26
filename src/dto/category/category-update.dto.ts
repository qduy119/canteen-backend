import { Category } from '@/databases/models';

export type CategoryUpdateDto = Partial<Omit<Category, 'id'>>;
