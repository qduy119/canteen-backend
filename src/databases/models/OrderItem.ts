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
import Order from './Order';
import Item from './Item';

class OrderItem extends Model<
  InferAttributes<OrderItem>,
  InferCreationAttributes<OrderItem>
> {
  declare id: CreationOptional<number>;
  declare itemId: ForeignKey<Item['id']>;
  declare orderId: ForeignKey<Order['id']>;
  declare quantity: number;
  declare price: number;
  declare item?: NonAttribute<Item>;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    itemId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Item',
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
    quantity: DataTypes.INTEGER,
    price: DataTypes.FLOAT
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'OrderItem',
    timestamps: false
  }
);

export default OrderItem;
