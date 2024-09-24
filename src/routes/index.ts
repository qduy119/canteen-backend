import { Application } from 'express';
import * as ItemRoute from './item.route';
import * as CategoryRoute from './category.route';
import * as CartItemRoute from './cart-item.route';
import * as OrderRoute from './order.route';
import * as SeatReservationRoute from './seat-reservation.route';
import * as ReviewRoute from './review.route';
import * as CouponRoute from './coupon.route';
import * as PaymentRoute from './payment.route';
import * as UserRoute from './user.route';
import * as AuthRoute from './auth.route';

export const init = (app: Application) => {
  ItemRoute.configure(app);
  CategoryRoute.configure(app);
  CartItemRoute.configure(app);
  OrderRoute.configure(app);
  SeatReservationRoute.configure(app);
  ReviewRoute.configure(app);
  CouponRoute.configure(app);
  PaymentRoute.configure(app);
  UserRoute.configure(app);
  AuthRoute.configure(app);
};
