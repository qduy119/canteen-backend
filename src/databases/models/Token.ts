import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  DataTypes
} from 'sequelize';
import sequelize from '../connection';
import User from './User';

class Token extends Model<
  InferAttributes<Token>,
  InferCreationAttributes<Token>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare token: string;
  declare expirationDate: Date;
}

Token.init(
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
    token: DataTypes.STRING,
    expirationDate: {
      type: DataTypes.DATE,
      validate: {
        isValid: (val: Date) => {
          if(val <= new Date()) {
            throw new Error('Expiration date is not valid');
          }
        }
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Token',
    timestamps: false
  }
);

export default Token;
