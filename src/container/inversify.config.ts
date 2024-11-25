import { Container, interfaces } from 'inversify';
import { TYPES } from './types';
import { IAuthService } from '@/services/auth/auth.service';
import {
  AuthServiceImpl,
  CartItemServiceImpl,
  CategoryServiceImpl,
  CouponServiceImpl,
  ItemServiceImpl,
  NodemailerServiceImpl,
  OrderItemServiceImpl,
  OrderServiceImpl,
  PaymentServiceImpl,
  ReviewServiceImpl,
  SeatReservationServiceImpl,
  TokenServiceImpl,
  UserServiceImpl
} from '@/services';
import { ICartItemService } from '@/services/cart-item/cart-item.service';
import { ICategoryService } from '@/services/category/category.service';
import { ICouponService } from '@/services/coupon/coupon.service';
import { IFoodService } from '@/services/food/food.service';
import { INodemailerService } from '@/services/nodemailer/nodemailer.service';
import { IOrderService } from '@/services/order/order.service';
import { IOrderItemService } from '@/services/order-item/order-item.service';
import { IPaymentService } from '@/services/payment/payment.service';
import {
  FactoryOfReviewService,
  IReviewService
} from '@/services/review/review.service';
import { ISeatReservationService } from '@/services/seat-reservation/seat-reservation.service';
import { ITokenService } from '@/services/token/token.service';
import { IUserService } from '@/services/user/user.service';

export const myContainer = new Container({ defaultScope: 'Singleton' });

myContainer.bind<IAuthService>(TYPES.AuthService).to(AuthServiceImpl);
myContainer
  .bind<ICartItemService>(TYPES.CartItemService)
  .to(CartItemServiceImpl);
myContainer
  .bind<ICategoryService>(TYPES.CategoryService)
  .to(CategoryServiceImpl);
myContainer.bind<ICouponService>(TYPES.CouponService).to(CouponServiceImpl);
myContainer.bind<IFoodService>(TYPES.FoodService).to(ItemServiceImpl);
myContainer
  .bind<INodemailerService>(TYPES.NodemailerService)
  .to(NodemailerServiceImpl);
myContainer.bind<IOrderService>(TYPES.OrderService).to(OrderServiceImpl);
myContainer
  .bind<IOrderItemService>(TYPES.OrderItemService)
  .to(OrderItemServiceImpl);
myContainer.bind<IPaymentService>(TYPES.PaymentService).to(PaymentServiceImpl);
myContainer.bind<IReviewService>(TYPES.ReviewService).to(ReviewServiceImpl);
myContainer
  .bind<FactoryOfReviewService>(TYPES.FatoryOfReviewService)
  .toFactory<IReviewService>((ctx: interfaces.Context) => {
    return (parent: IFoodService) => {
      const reviewService = ctx.container.get<IReviewService>(
        TYPES.ReviewService
      );
      reviewService.setFoodDependencyInstance(parent);
      return reviewService;
    };
  });
myContainer
  .bind<ISeatReservationService>(TYPES.SeatReservationService)
  .to(SeatReservationServiceImpl);
myContainer.bind<ITokenService>(TYPES.TokenService).to(TokenServiceImpl);
myContainer.bind<IUserService>(TYPES.UserService).to(UserServiceImpl);
