import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { ItemController } from '@/controllers';
import { myContainer } from '@/container/inversify.config';
import { IFoodService } from '@/services/food/food.service';
import { TYPES } from '@/container/types';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const itemService = myContainer.get<IFoodService>(TYPES.FoodService);
  const itemController = new ItemController(itemService);

  router
    .route('/')
    .get(itemController.getAll)
    .post(protect, restrictTo('Admin'), itemController.create);
  router.route('/top-5').get(itemController.getTopSales); 
  router
    .route('/:id')
    .get(itemController.getById)
    .put(protect, restrictTo('Admin'), itemController.update)
    .delete(protect, restrictTo('Admin'), itemController.delete);

  app.use('/api/item', router);
};
