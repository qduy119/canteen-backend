import { User } from '@/databases/models';
import { UserUpdateDto } from '@/dto/user/user-update.dto';
import { IUserService } from './user.service';

export default class UserServiceImpl implements IUserService {
  async getAll(): Promise<User[]> {
    const data = await User.findAll();
    return data;
  }
  async getById(id: string): Promise<User> {
    const data = await User.findByPk(id);
    delete data.get().password;
    return data;
  }
  async update(id: number, payload: UserUpdateDto): Promise<void> {
    await User.update(payload, { where: { id } });
  }
  async delete(id: number): Promise<void> {
    await User.destroy({ where: { id } });
  }
}
