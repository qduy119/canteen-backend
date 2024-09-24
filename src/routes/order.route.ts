import { Application, Router } from 'express';
import { protect, restrictTo } from '@/middlewares/auth';
import {
  CartItemServiceImpl,
  CouponServiceImpl,
  ItemServiceImpl,
  NodemailerServiceImpl,
  OrderItemServiceImpl,
  OrderServiceImpl,
  SeatReservationServiceImpl
} from '@/services';
import { OrderController } from '@/controllers';

export const configure = (app: Application) => {
  const router = Router({ mergeParams: true });

  const nodemailerService = new NodemailerServiceImpl();
  const itemService = new ItemServiceImpl(nodemailerService);
  const cartItemService = new CartItemServiceImpl(itemService);
  const orderItemService = new OrderItemServiceImpl();
  const couponService = new CouponServiceImpl();
  const seatReservation = new SeatReservationServiceImpl();
  const orderService = new OrderServiceImpl(
    orderItemService,
    cartItemService,
    couponService,
    seatReservation
  );
  const orderController = new OrderController(orderService);

  router.use(protect);
  router
    .route('/')
    .get(restrictTo('Customer', 'Admin'), orderController.getAll)
    .post(restrictTo('Customer'), orderController.createOrder);
  router
    .route('/:id')
    .get(restrictTo('Customer', 'Admin'), orderController.getById)
    .put(restrictTo('Customer'), orderController.update);
  router
    .route('/cancel/:id')
    .put(restrictTo('Customer', 'Admin'), orderController.cancelOrder);

  app.use('/api/order', router);
};
