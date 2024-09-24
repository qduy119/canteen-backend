import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { CategoryServiceImpl } from '@/services';
import { CategoryController } from '@/controllers';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const categoryService = new CategoryServiceImpl();
  const categoryController = new CategoryController(categoryService);

  router
    .route('/')
    .get(categoryController.getAll)
    .post(protect, restrictTo('Admin'), categoryController.create);
  router
    .route('/:id')
    .get(categoryController.getById)
    .put(protect, restrictTo('Admin'), categoryController.update)
    .delete(protect, restrictTo('Admin'), categoryController.delete);

  app.use('/api/category', router);
};
