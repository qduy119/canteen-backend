import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { ReviewServiceImpl } from '@/services';
import { ReviewController } from '@/controllers';
import { imagesUploadHandler } from '@/utils/upload';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const reviewService = new ReviewServiceImpl();
  const reviewController = new ReviewController(reviewService);

  router.use(protect);

  router
    .route('/')
    .post(
      restrictTo('Customer'),
      imagesUploadHandler('images_feedback', 3),
      reviewController.create
    );
  router
    .route('/check-rating/:id')
    .get(restrictTo('Customer'), reviewController.isRated);

  app.use('/api/review', router);
};
