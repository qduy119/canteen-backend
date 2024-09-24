import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import { SeatReservationServiceImpl } from '@/services';
import { SeatReservationController } from '@/controllers';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const seatReservationService = new SeatReservationServiceImpl();
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
