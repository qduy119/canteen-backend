import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { PaymentServiceImpl } from '@/services';
import { PaymentController } from '@/controllers';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const paymentService = new PaymentServiceImpl();
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
