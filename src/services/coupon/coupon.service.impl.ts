import { Op } from 'sequelize';
import sequelize from '@/databases/connection';
import { Coupon } from '@/databases/models';
import { CouponCreateDto } from '@/dto/coupon/coupon-create.dto';
import { CouponUpdateDto } from '@/dto/coupon/coupon-update.dto';
import { ICouponService } from './coupon.service';
import { injectable } from 'inversify';

@injectable()
export default class CouponServiceImpl implements ICouponService {
  async getAll(): Promise<Coupon[]> {
    const data = await Coupon.findAll({
      where: {
        expirationDate: {
          [Op.gt]: new Date()
        },
        usedQuantity: {
          [Op.lt]: sequelize.col('usageLimit')
        }
      }
    });
    return data;
  }
  async getById(id: number): Promise<Coupon> {
    const data = await Coupon.findByPk(id);
    return data;
  }
  async create(payload: CouponCreateDto): Promise<void> {
    await Coupon.create(payload);
  }
  async update(id: number, payload: CouponUpdateDto): Promise<void> {
    await Coupon.update(payload, { where: { id } });
  }
  async delete(id: number): Promise<void> {
    await Coupon.destroy({ where: { id } });
  }
  async modifyUsedQuantity(
    usedQuantity: number,
    couponCode: string
  ): Promise<void> {
    await Coupon.increment(
      { usedQuantity },
      {
        where: {
          code: couponCode
        }
      }
    );
  }
}
