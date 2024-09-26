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
import OrderItem from './OrderItem';

class Review extends Model<
  InferAttributes<Review>,
  InferCreationAttributes<Review>
> {
  declare id: CreationOptional<number>;
  declare orderItemId: ForeignKey<OrderItem['id']>;
  declare userId: ForeignKey<User['id']>;
  declare rating: number;
  declare description: string;
  declare images: string[] | null;
  declare createAt: Date;
  declare user?: NonAttribute<User>;
}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    orderItemId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'OrderItem',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.STRING,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        max: 5
      }
    },
    description: DataTypes.TEXT,
    images: DataTypes.JSON,
    createAt: DataTypes.DATE
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Review',
    timestamps: false
  }
);

export default Review;
