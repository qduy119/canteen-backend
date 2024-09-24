import { IUserService } from '@/services/user/user.service';
import { NextFunction, Request, Response } from 'express';

export default class UserController {
  constructor(private readonly userService: IUserService) {}

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      const data = await this.userService.getById(id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.userService.getById(id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  getRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.user.id;
      const data = await this.userService.getById(id);
      res.status(200).json(data.role);
    } catch (error) {
      next(error);
    }
  };
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.userService.getAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      await this.userService.update(Number(id), payload);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.userService.delete(Number(id));
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
}
