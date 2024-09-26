import { Item } from '@/databases/models';

export type ItemCreateDto = Partial<Omit<Item, 'id'>> & {
  isSendNotification: boolean;
};
