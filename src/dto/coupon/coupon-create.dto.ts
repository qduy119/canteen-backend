import { Coupon } from '@/databases/models';

export type CouponCreateDto = Partial<Omit<Coupon, 'id'>>;
