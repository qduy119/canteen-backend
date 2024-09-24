import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  DataTypes
} from 'sequelize';
import sequelize from '../connection';
import Order from './Order';

class SeatReservation extends Model<
  InferAttributes<SeatReservation>,
  InferCreationAttributes<SeatReservation>
> {
  declare id: CreationOptional<number>;
  declare orderId: ForeignKey<Order['id']>;
  declare seatNumber: number;
}

SeatReservation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Order',
        key: 'id'
      }
    },
    seatNumber: {
      type: DataTypes.INTEGER,
      validate: {
        max: 20
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'SeatReservation',
    timestamps: false
  }
);

export default SeatReservation;
