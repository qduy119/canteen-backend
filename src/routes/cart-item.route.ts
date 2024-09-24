import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import {
  ItemServiceImpl,
  CartItemServiceImpl,
  NodemailerServiceImpl
} from '@/services';
import { CartItemController } from '@/controllers';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const nodemailerService = new NodemailerServiceImpl();
  const itemService = new ItemServiceImpl(nodemailerService);
  const cartItemService = new CartItemServiceImpl(itemService);
  const cartItemController = new CartItemController(cartItemService);

  router.use(protect);
  router
    .route('/')
    .get(restrictTo('Customer'), cartItemController.getAll)
    .post(restrictTo('Customer'), cartItemController.create);
  router
    .route('/:id')
    .put(restrictTo('Customer'), cartItemController.update)
    .delete(restrictTo('Customer'), cartItemController.delete);

  app.use('/api/cart-item', router);
};
