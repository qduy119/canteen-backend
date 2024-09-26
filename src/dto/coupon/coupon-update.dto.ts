import { Coupon } from '@/databases/models';

export type CouponUpdateDto = Partial<Omit<Coupon, 'id'>>;
