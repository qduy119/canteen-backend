import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  NonAttribute
} from 'sequelize';
import sequelize from '../connection';
import Item from './Item';

class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  declare id: CreationOptional<number>;
  declare thumbnail: string;
  declare name: string;
  declare description: string;
  declare items?: NonAttribute<Item[]>;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    thumbnail: DataTypes.TEXT,
    name: DataTypes.TEXT,
    description: DataTypes.TEXT
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Category',
    timestamps: false
  }
);

export default Category;
