import { User } from '@/databases/models';
import { UserUpdateDto } from '@/dto/user/user-update.dto';
import { IUserService } from './user.service';
import { injectable } from 'inversify';
import { Op } from 'sequelize';

@injectable()
export default class UserServiceImpl implements IUserService {
  async getAll(): Promise<User[]> {
    const data = await User.findAll();
    return data;
  }
  async getAllCustomerEmails(): Promise<string[]> {
    const emails = await User.findAll({
      where: {
        role: {
          [Op.ne]: 'Admin'
        }
      },
      attributes: ['email'],
      raw: true
    });

    return emails.map((item) => item.email);
  }
  async getById(id: string): Promise<User> {
    const data = await User.findByPk(id);
    delete data.get().password;
    return data;
  }
  async update(id: string, payload: UserUpdateDto): Promise<void> {
    await User.update(payload, { where: { id } });
  }
  async delete(id: string): Promise<void> {
    await User.destroy({ where: { id } });
  }
}