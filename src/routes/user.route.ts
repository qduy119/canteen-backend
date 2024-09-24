import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { UserServiceImpl } from '@/services';
import { UserController } from '@/controllers';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const userService = new UserServiceImpl();
  const userController = new UserController(userService);

  router.use(protect);

  router
    .route('/me')
    .get(restrictTo('Customer', 'Admin'), userController.getMe);
  router
    .route('/user')
    .get(restrictTo('Admin'), userController.getAll);
  router
    .route('/user/:id')
    .put(restrictTo('Customer', 'Admin'), userController.update)
    .delete(restrictTo('Customer', 'Admin'), userController.delete)
    .get(restrictTo('Customer', 'Admin'), userController.getById);

  app.use('/api', router);
};
