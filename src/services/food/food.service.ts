import { Item, Review } from '@/databases/models';
import { ItemCreateDto } from '@/dto/item/item-create.dto';
import { ItemUpdateDto } from '@/dto/item/item-update.dto';
import { PaginationResponse } from '@/dto/pagination';

export interface IFoodService {
  getAll(
    page: number | undefined,
    per_page: number | undefined,
    keyword: string | undefined,
    categoryId: number | undefined
  ): Promise<PaginationResponse<Item>>;
  getTopSales(): Promise<Item[]>;
  getById(id: number): Promise<{ data: Item; reviews: Review[] }>;
  create(payload: ItemCreateDto): Promise<void>;
  update(id: number, payload: ItemUpdateDto): Promise<void>;
  delete(id: number): Promise<void>;
  modifyQuantity(
    quantityToModify: number,
    itemId: number,
    options?: any
  ): Promise<void>;
}
