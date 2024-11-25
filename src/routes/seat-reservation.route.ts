import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { SeatReservationController } from '@/controllers';
import { ISeatReservationService } from '@/services/seat-reservation/seat-reservation.service';
import { myContainer, TYPES } from '@/container';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const seatReservationService = myContainer.get<ISeatReservationService>(
    TYPES.SeatReservationService
  );
  const seatReservationController = new SeatReservationController(
    seatReservationService
  );

  router.use(protect);

  router
    .route('/')
    .get(seatReservationController.getAll)
    .post(restrictTo('Customer', 'Admin'), seatReservationController.create)
    .delete(restrictTo('Customer', 'Admin'), seatReservationController.delete);

  app.use('/api/seat-reservation', router);
};
