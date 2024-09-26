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
import Item from './Item';

class CartItem extends Model<
  InferAttributes<CartItem>,
  InferCreationAttributes<CartItem>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare itemId: ForeignKey<Item['id']>;
  declare quantity: number;
  declare item?: NonAttribute<Item>;
}

CartItem.init(
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
    itemId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Item',
        key: 'id'
      }
    },
    quantity: DataTypes.INTEGER
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'CartItem',
    timestamps: false
  }
);

export default CartItem;
