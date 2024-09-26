import { User } from '@/databases/models';
import { UserUpdateDto } from '@/dto/user/user-update.dto';

export interface IUserService {
  getAll(): Promise<User[]>;
  getAllCustomerEmails(): Promise<string[]>
  getById(id: string): Promise<User>;
  update(id: number, payload: UserUpdateDto): Promise<void>;
  delete(id: number): Promise<void>;
}
