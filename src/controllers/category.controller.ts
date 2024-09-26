import { TYPES } from '@/container/types';
import { ICategoryService } from '@/services/category/category.service';
import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';

export default class CategoryController {
  constructor(
    @inject(TYPES.CategoryService)
    private readonly categoryService: ICategoryService
  ) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.categoryService.getAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.categoryService.getById(Number(id));
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      await this.categoryService.create(payload);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      await this.categoryService.update(Number(id), payload);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.categoryService.delete(Number(id));
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
}
