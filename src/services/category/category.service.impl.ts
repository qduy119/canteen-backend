import { Category } from '@/databases/models';
import { CategoryCreateDto } from '@/dto/category/category-create.dto';
import { CategoryUpdateDto } from '@/dto/category/category-update.dto';
import { ICategoryService } from './category.service';
import { injectable } from 'inversify';

@injectable()
export default class CategoryServiceImpl implements ICategoryService {
  async getAll(): Promise<Category[]> {
    const data = await Category.findAll();
    return data;
  }
  async getById(id: number): Promise<Category> {
    const data = await Category.findByPk(id);
    return data;
  }
  async create(payload: CategoryCreateDto): Promise<void> {
    await Category.create(payload);
  }
  async update(id: number, payload: CategoryUpdateDto): Promise<void> {
    await Category.update(payload, { where: { id } });
  }
  async delete(id: number): Promise<void> {
    await Category.destroy({ where: { id } });
  }
}
