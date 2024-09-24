import { IReviewService } from '@/services/review/review.service';
import { NextFunction, Request, Response } from 'express';

export default class ReviewController {
  constructor(private readonly reviewService: IReviewService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const userId = req.user.id;
      const files = Array.isArray(req.files) ? req.files : [];
      const images = files.map((file) => file.path);
      await this.reviewService.create({ ...payload, images, userId });
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  isRated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.reviewService.isRated(Number(id));
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
}
