import passport from 'passport';
import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { AuthController } from '@/controllers';
import { IAuthService } from '@/services/auth/auth.service';
import { myContainer, TYPES } from '@/container';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const authService = myContainer.get<IAuthService>(TYPES.AuthService);
  const authController = new AuthController(authService);

  router.route('/authenticate').post(authController.authenticate);

  router
    .route('/google')
    .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.route('/google/callback').get((req, res, next) => {
    passport.authenticate(
      'google',
      authController.handleThirdPartyAuthentication(req, res, next)
    )(req, res, next);
  });

  router.route('/github').get(passport.authenticate('github'));

  router.route('/github/callback').get((req, res, next) => {
    passport.authenticate(
      'github',
      authController.handleThirdPartyAuthentication(req, res, next)
    )(req, res, next);
  });

  router.route('/register').post(authController.register);

  router
    .route('/logout')
    .post(protect, restrictTo('Customer', 'Admin'), authController.logout);
  router.route('/refresh-token').get(authController.refresh);

  app.use('/auth', router);
};
