import { Coupon } from '@/databases/models';
import { CouponCreateDto } from '@/dto/coupon/coupon-create.dto';
import { CouponUpdateDto } from '@/dto/coupon/coupon-update.dto';

export interface ICouponService {
  getAll(): Promise<Coupon[]>;
  getById(id: number): Promise<Coupon>;
  create(payload: CouponCreateDto): Promise<void>;
  update(id: number, payload: CouponUpdateDto): Promise<void>;
  delete(id: number): Promise<void>;
  modifyUsedQuantity(usedQuantity: number, couponCode: string): Promise<void>;
}
