import { ICouponService } from '@/services/coupon/coupon.service';
import { NextFunction, Request, Response } from 'express';

export default class CouponController {
  constructor(private readonly couponService: ICouponService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.couponService.getAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.couponService.getById(Number(id));
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      await this.couponService.create(payload);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      await this.couponService.update(Number(id), payload);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.couponService.delete(Number(id));
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
}
