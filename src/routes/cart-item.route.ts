import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { CartItemController } from '@/controllers';
import { myContainer } from '@/container/inversify.config';
import { ICartItemService } from '@/services/cart-item/cart-item.service';
import { TYPES } from '@/container/types';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const cartItemService = myContainer.get<ICartItemService>(
    TYPES.CartItemService
  );
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
