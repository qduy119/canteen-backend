import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes
} from 'sequelize';
import sequelize from '../connection';

class Coupon extends Model<
  InferAttributes<Coupon>,
  InferCreationAttributes<Coupon>
> {
  declare id: CreationOptional<number>;
  declare code: string;
  declare title: string;
  declare discountPercentage: number;
  declare expirationDate: Date;
  declare usedQuantity: number;
  declare usageLimit: number;
}

Coupon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.TEXT
    },
    title: DataTypes.TEXT,
    discountPercentage: {
      type: DataTypes.FLOAT,
      validate: {
        min: 0
      }
    },
    expirationDate: {
      type: DataTypes.DATE,
      validate: {
        isValid: (val: Date) => {
          if (val <= new Date()) {
            throw new Error('Expiration date is not valid');
          }
        }
      }
    },
    usedQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    usageLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      validate: {
        min: 1
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Coupon',
    timestamps: false
  }
);

export default Coupon;
