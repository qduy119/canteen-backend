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
import User from './User';
import Order from './Order';

class Payment extends Model<
  InferAttributes<Payment>,
  InferCreationAttributes<Payment>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare orderId: ForeignKey<Order['id']>;
  declare payDate: Date;
  declare bankCode: string;
  declare cardType: string;
  declare amount: number;
  declare status: 'Pending' | 'Success' | 'Cancel' | 'Error';
  declare user?: NonAttribute<User>;
}

Payment.init(
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
    orderId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Order',
        key: 'id'
      }
    },
    payDate: DataTypes.DATE,
    bankCode: DataTypes.TEXT,
    cardType: DataTypes.TEXT,
    amount: DataTypes.FLOAT,
    status: {
      type: DataTypes.ENUM('Pending', 'Success', 'Cancel', 'Error'),
      defaultValue: 'Pending'
    }
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Payment',
    timestamps: false
  }
);

export default Payment;
