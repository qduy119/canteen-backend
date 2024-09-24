import { NextFunction, Request, Response } from 'express';
import { IPaymentService } from '@/services/payment/payment.service';

export default class PaymentController {
  constructor(private readonly paymentService: IPaymentService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.query;
      const data = await this.paymentService.getAll(String(userId));
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const userId = req.user.id;
      const data = await this.paymentService.create({
        userId,
        ...payload
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      await this.paymentService.update(Number(id), payload);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  createPaymentUrl = (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = this.paymentService.createPaymentUrl(req);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
}
