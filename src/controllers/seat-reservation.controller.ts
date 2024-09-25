import { TYPES } from '@/container/types';
import { ISeatReservationService } from '@/services/seat-reservation/seat-reservation.service';
import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';

export default class SeatReservationController {
  constructor(
    @inject(TYPES.SeatReservationService)
    private readonly seatReservationService: ISeatReservationService
  ) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.seatReservationService.getAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      await this.seatReservationService.create(payload);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { seatNumber, orderId } = req.query;
      const payload = {
        seatNumber: Number(seatNumber),
        orderId: Number(orderId)
      };
      await this.seatReservationService.delete(payload);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
}
