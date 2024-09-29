import { User } from '@/databases/models';
import { ChangePasswordDto } from '@/dto/user/change-password.dto';
import { UserUpdateDto } from '@/dto/user/user-update.dto';

export interface IUserService {
  getAll(): Promise<User[]>;
  getAllCustomerEmails(): Promise<string[]>;
  changePassword(id: string, payload: ChangePasswordDto): Promise<void>;
  forgotPassword(id: string): Promise<void>;
  getById(id: string): Promise<User>;
  update(id: string, payload: UserUpdateDto): Promise<void>;
  delete(id: string): Promise<void>;
}
