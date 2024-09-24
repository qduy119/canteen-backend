import { User } from '@/databases/models';

export type RegisterDto = Partial<Omit<User, 'id'>>;
