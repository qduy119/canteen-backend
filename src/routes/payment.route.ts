import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { PaymentController } from '@/controllers';
import { myContainer } from '@/container/inversify.config';
import { IPaymentService } from '@/services/payment/payment.service';
import { TYPES } from '@/container/types';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const paymentService = myContainer.get<IPaymentService>(TYPES.PaymentService);
  const paymentController = new PaymentController(paymentService);

  router.use(protect);

  router
    .route('/')
    .get(restrictTo('Customer', 'Admin'), paymentController.getAll)
    .post(restrictTo('Customer'), paymentController.create);
  router.route('/:id').put(restrictTo('Customer'), paymentController.update);
  router
    .route('/create-payment-url')
    .post(restrictTo('Customer'), paymentController.createPaymentUrl);

  app.use('/api/payment', router);
};
