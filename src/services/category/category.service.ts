import Category from '@/databases/models/Category';
import { CategoryCreateDto } from '@/dto/category/category-create.dto';
import { CategoryUpdateDto } from '@/dto/category/category-update.dto';

export interface ICategoryService {
  getAll(): Promise<Category[]>;
  getById(id: number): Promise<Category>;
  create(payload: CategoryCreateDto): Promise<void>;
  update(id: number, payload: CategoryUpdateDto): Promise<void>;
  delete(id: number): Promise<void>;
}
