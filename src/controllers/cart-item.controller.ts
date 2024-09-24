import { ICartItemService } from '@/services/cart-item/cart-item.service';
import { NextFunction, Request, Response } from 'express';

export default class CartItemController {
  constructor(private readonly cartItemService: ICartItemService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const data = await this.cartItemService.getAll(userId);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const payload = { ...req.body, userId };
      const data = await this.cartItemService.create(payload);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      await this.cartItemService.update(Number(id), payload);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.cartItemService.delete(Number(id));
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
}
