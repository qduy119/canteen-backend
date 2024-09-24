import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  DataTypes,
  NonAttribute
} from 'sequelize';
import sequelize from '../connection';
import OrderItem from './OrderItem';
import Payment from './Payment';
import User from './User';

class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare orderDate: Date;
  declare couponCode: string;
  declare couponTitle: string;
  declare discountPercentage: number;
  declare total: number;
  declare seatNumber: number;
  declare status: 'Pending' | 'Success' | 'Cancel' | 'Error';
  declare orderItems?: NonAttribute<OrderItem[]>;
  declare payment?: NonAttribute<Payment[]>;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.STRING,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    orderDate: DataTypes.DATE,
    couponCode: DataTypes.TEXT,
    couponTitle: DataTypes.TEXT,
    discountPercentage: DataTypes.FLOAT,
    total: DataTypes.FLOAT,
    seatNumber: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('Pending', 'Success', 'Cancel', 'Error'),
      defaultValue: 'Pending'
    }
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Order',
    timestamps: false
  }
);

export default Order;
