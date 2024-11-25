import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { CategoryController } from '@/controllers';
import { ICategoryService } from '@/services/category/category.service';
import { myContainer, TYPES } from '@/container';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const categoryService = myContainer.get<ICategoryService>(
    TYPES.CategoryService
  );
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
