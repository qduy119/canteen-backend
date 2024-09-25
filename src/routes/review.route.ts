import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { ReviewController } from '@/controllers';
import { imagesUploadHandler } from '@/utils/upload';
import { myContainer } from '@/container/inversify.config';
import { IReviewService } from '@/services/review/review.service';
import { TYPES } from '@/container/types';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const reviewService = myContainer.get<IReviewService>(TYPES.ReviewService);
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
