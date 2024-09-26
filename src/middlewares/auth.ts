import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { CustomError } from '@/utils/error';
import { User } from '@/databases/models';
import { JwtPayload } from '@/utils/token';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    if (req.headers.authorization.split(' ')[1] === 'null') {
      token = null;
    } else {
      token = req.headers.authorization.split(' ')[1];
    }
  }
  if (!token) {
    return next(new Error('You are not logged in'));
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (error, data: JwtPayload) => {
      if (!data) {
        return next(new CustomError(401));
      }
      if (error) {
        return next(error);
      }
      const freshUser = await User.findOne({
        where: {
          id: data.id
        }
      });
      if (!freshUser) {
        return next(new Error('User no longer exists'));
      }
      // Grant access to protected route
      delete freshUser.get().password;
      req.user = freshUser;
      next();
    }
  );
};

export const restrictTo =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req?.user.role)) {
      return next(
        new CustomError(403, 'You are not allowed to do this action!')
      );
    }
    next();
  };
