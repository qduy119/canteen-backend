import {
  CartItem,
  Category,
  Item,
  Order,
  OrderItem,
  Payment,
  Review,
  SeatReservation,
  Token,
  User
} from './models';

export const define = () => {
  /** CartItem association */
  CartItem.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id'
  });
  CartItem.belongsTo(Item, {
    foreignKey: 'itemId',
    targetKey: 'id',
    as: 'item'
  });

  /** Category association */
  Category.hasMany(Item, {
    foreignKey: 'categoryId',
    as: 'items'
  });
  Category.hasMany(Item, {
    foreignKey: 'categoryId'
  });

  /** Item association */
  Item.hasMany(CartItem, {
    foreignKey: 'itemId'
  });
  Item.hasMany(OrderItem, {
    foreignKey: 'itemId',
    as: 'items'
  });
  Item.belongsTo(Category, {
    foreignKey: 'categoryId',
    targetKey: 'id',
    as: 'category'
  });

  /** Order association */
  Order.hasMany(OrderItem, {
    foreignKey: 'orderId',
    as: 'orderItems'
  });
  Order.hasOne(Payment, {
    foreignKey: 'orderId',
    as: 'payment'
  });
  Order.hasOne(SeatReservation, {
    foreignKey: 'orderId'
  });
  Order.belongsTo(User, {
    foreignKey: 'userId'
  });

  /** OrderItem association */
  OrderItem.belongsTo(Order, {
    foreignKey: 'orderId',
    targetKey: 'id'
  });
  OrderItem.belongsTo(Item, {
    foreignKey: 'itemId',
    targetKey: 'id',
    as: 'item'
  });
  OrderItem.hasMany(Review, {
    foreignKey: 'orderItemId'
  });

  /** Payment association */
  Payment.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'user'
  });
  Payment.belongsTo(Order, {
    foreignKey: 'orderId',
    targetKey: 'id'
  });

  /** Review association */
  Review.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'user'
  });
  Review.belongsTo(OrderItem, {
    foreignKey: 'orderItemId',
    targetKey: 'id'
  });

  /** SeatReservation association */
  SeatReservation.belongsTo(Order, {
    foreignKey: 'orderId',
    targetKey: 'id'
  });

  /** User association */
  User.hasMany(CartItem, { foreignKey: 'userId', as: 'cartItems' });
  User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
  User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
  User.hasMany(Review, { foreignKey: 'userId' });
  User.hasMany(Token, { foreignKey: 'userId' });

  /** Token association */
  Token.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id'
  });
};
