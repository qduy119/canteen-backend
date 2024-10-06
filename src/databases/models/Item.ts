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
import Category from './Category';

class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
  declare id: CreationOptional<number>;
  declare categoryId: ForeignKey<Category['id']>;
  declare thumbnail: string;
  declare name: string;
  declare description: string;
  declare price: number;
  declare discount: number;
  declare stock: number;
  declare images: string[] | null;
  declare rating: number;
  declare items?: NonAttribute<OrderItem[]>;
  declare category?: NonAttribute<Category>;
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Category',
        key: 'id'
      }
    },
    thumbnail: DataTypes.TEXT,
    name: DataTypes.TEXT,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    discount: DataTypes.FLOAT,
    stock: DataTypes.INTEGER,
    images: DataTypes.JSON,
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        max: 5
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Item',
    timestamps: false
  }
);

export default Item;
