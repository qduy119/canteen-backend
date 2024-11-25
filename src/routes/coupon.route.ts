import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { CouponController } from '@/controllers';
import { ICouponService } from '@/services/coupon/coupon.service';
import { myContainer, TYPES } from '@/container';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const couponService = myContainer.get<ICouponService>(TYPES.CouponService);
  const couponController = new CouponController(couponService);

  router.use(protect);

  router
    .route('/')
    .get(couponController.getAll)
    .post(restrictTo('Admin'), couponController.create);

  router
    .route('/:id')
    .get(restrictTo('Customer', 'Admin'), couponController.getById)
    .put(restrictTo('Admin'), couponController.update)
    .delete(restrictTo('Admin'), couponController.delete);

  app.use('/api/coupon', router);
};
