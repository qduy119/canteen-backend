import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { OrderController } from '@/controllers';
import { myContainer } from '@/container/inversify.config';
import { IOrderService } from '@/services/order/order.service';
import { TYPES } from '@/container/types';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const orderService = myContainer.get<IOrderService>(TYPES.OrderService);
  const orderController = new OrderController(orderService);

  router.use(protect);
  router
    .route('/')
    .get(restrictTo('Customer', 'Admin'), orderController.getAll)
    .post(restrictTo('Customer'), orderController.createOrder);
  router
    .route('/:id')
    .get(restrictTo('Customer', 'Admin'), orderController.getById)
    .put(restrictTo('Customer'), orderController.update);
  router
    .route('/cancel/:id')
    .put(restrictTo('Customer', 'Admin'), orderController.cancelOrder);

  app.use('/api/order', router);
};
