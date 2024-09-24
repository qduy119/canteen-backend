import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { ItemServiceImpl, NodemailerServiceImpl } from '@/services';
import { ItemController } from '@/controllers';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const nodemailerService = new NodemailerServiceImpl();
  const itemService = new ItemServiceImpl(nodemailerService);
  const itemController = new ItemController(itemService);

  router
    .route('/')
    .get(itemController.getAll)
    .post(protect, restrictTo('Admin'), itemController.create);
  router
    .route('/:id')
    .get(itemController.getById)
    .put(protect, restrictTo('Admin'), itemController.update)
    .delete(protect, restrictTo('Admin'), itemController.delete);
  router.route('/top-5').get(itemController.getTopSales);

  app.use('/api/item', router);
};
