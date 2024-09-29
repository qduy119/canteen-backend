import { User } from '@/databases/models';
import { UserUpdateDto } from '@/dto/user/user-update.dto';
import { IUserService } from './user.service';
import { inject, injectable } from 'inversify';
import { Op } from 'sequelize';
import crypto from 'crypto';
import { ChangePasswordDto } from '@/dto/user/change-password.dto';
import { CustomError } from '@/utils/error';
import { TYPES } from '@/container/types';
import { INodemailerService } from '../nodemailer/nodemailer.service';

@injectable()
export default class UserServiceImpl implements IUserService {
  constructor(
    @inject(TYPES.NodemailerService)
    private readonly nodemailerService: INodemailerService
  ) {}

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
  async changePassword(id: string, payload: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = payload;
    const user = await User.findByPk(id);
    if (!(await user.correctPassword(currentPassword))) {
      throw new CustomError(409, 'Password is incorrect');
    }
    await user.update({ password: newPassword });
  }
  async forgotPassword(id: string): Promise<void> {
    const user = await User.findByPk(id);
    const length = 16;
    const newPassword = crypto
      .randomBytes(length)
      .toString('hex')
      .slice(0, length);

    await user.update({ password: newPassword });
    const contentToSend = {
      subject: 'FORGOT PASSWORD',
      content: `<p>Your new passport: ${newPassword}</p>`,
      to: user.email
    };
    await this.nodemailerService.send(contentToSend);
  }
}
