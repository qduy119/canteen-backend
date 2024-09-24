import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { CouponServiceImpl } from '@/services';
import { CouponController } from '@/controllers';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const couponService = new CouponServiceImpl();
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
