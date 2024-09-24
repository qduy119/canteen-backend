import { IOrderService } from '@/services/order/order.service';
import { NextFunction, Request, Response } from 'express';

export default class OrderController {
  constructor(private readonly orderService: IOrderService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, per_page } = req.query;
      const { id: userId, role } = req.user;
      const data = await this.orderService.getAll(
        page ? Number(page) : undefined,
        per_page ? Number(per_page) : undefined,
        userId,
        role
      );
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.orderService.getById(Number(id));
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const userId = req.user.id;
      await this.orderService.createOrder({
        userId,
        ...payload
      });
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      await this.orderService.update(Number(id), payload);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.orderService.cancelOrder(Number(id));
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
}
