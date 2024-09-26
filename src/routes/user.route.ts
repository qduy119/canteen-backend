import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { UserController } from '@/controllers';
import { myContainer } from '@/container/inversify.config';
import { IUserService } from '@/services/user/user.service';
import { TYPES } from '@/container/types';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const userService = myContainer.get<IUserService>(TYPES.UserService);
  const userController = new UserController(userService);

  router.use(protect);

  router
    .route('/me')
    .get(restrictTo('Customer', 'Admin'), userController.getMe);
  router.route('/user').get(restrictTo('Admin'), userController.getAll);
  router
    .route('/user/:id')
    .put(restrictTo('Customer', 'Admin'), userController.update)
    .delete(restrictTo('Customer', 'Admin'), userController.delete)
    .get(restrictTo('Customer', 'Admin'), userController.getById);

  app.use('/api', router);
};
