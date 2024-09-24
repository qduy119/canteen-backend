import { Item } from '@/databases/models';

export type ItemUpdateDto = Partial<Omit<Item, 'id'>>;
