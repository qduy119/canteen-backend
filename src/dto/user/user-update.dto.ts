import { User } from '@/databases/models';

export type UserUpdateDto = Partial<Omit<User, 'id'>>;
