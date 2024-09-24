import { IFoodService } from '@/services/food/food.service';
import { NextFunction, Request, Response } from 'express';

export default class ItemController {
  constructor(private readonly itemService: IFoodService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, per_page, keyword, categoryId } = req.query;
      const data = await this.itemService.getAll(
        page ? Number(page) : undefined,
        per_page ? Number(per_page) : undefined,
        keyword ? String(keyword) : undefined,
        categoryId ? Number(categoryId) : undefined
      );
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  getTopSales = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.itemService.getTopSales();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.itemService.getById(Number(id));
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      await this.itemService.create(payload);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      await this.itemService.update(Number(id), payload);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.itemService.delete(Number(id));
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
}
