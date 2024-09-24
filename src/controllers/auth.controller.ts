import { IAuthService } from '@/services/auth/auth.service';
import { CustomError } from '@/utils/error';
import { NextFunction, Request, Response } from 'express';

export default class AuthController {
  constructor(private readonly authService: IAuthService) {}

  authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const { accessToken, refreshToken } =
        await this.authService.authenticate(payload);
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  };
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      await this.authService.register(payload);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new CustomError(400, 'You are not logged in ');
      }
      await this.authService.logout(refreshToken);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new CustomError(400, 'You are not logged in ');
      }
      await this.authService.refresh(refreshToken);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  handleThirdPartyAuthentication = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      return async (error: any, user: any, info: any) => {
        await this.authService.handleThirdPartyAuthentication(
          error,
          user,
          info,
          res
        );
      };
    } catch (error) {
      next(error);
    }
  };
}
