import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  NonAttribute
} from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../connection';
import CartItem from './CartItem';
import Order from './Order';
import Payment from './Payment';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare email: string;
  declare password?: string;
  declare provider: string;
  declare phoneNumber: string;
  declare fullName: string;
  declare avatar: string;
  declare gender: string;
  declare dateOfBirth: Date;
  declare role: 'Customer' | 'Admin' | 'Employee';
  declare cartItems?: NonAttribute<CartItem[]>;
  declare orders?: NonAttribute<Order[]>;
  declare payments?: NonAttribute<Payment[]>;

  async correctPassword(userPassword: string): Promise<boolean> {
    if (this.password) {
      return await bcrypt.compare(userPassword, this.password);
    }
    return false;
  }
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.TEXT,
      validate: {
        isEmail: true
      }
    },
    password: DataTypes.TEXT,
    provider: {
      type: DataTypes.ENUM('google', 'github', 'default'),
      defaultValue: 'default',
      validate: {
        isIn: {
          args: [['google', 'github', 'default']],
          msg: 'Must be Google, Github or Default'
        }
      }
    },
    phoneNumber: DataTypes.TEXT,
    fullName: DataTypes.TEXT,
    avatar: {
      type: DataTypes.TEXT,
      defaultValue:
        'https://res.cloudinary.com/dlzyiprib/image/upload/v1694617729/e-commerces/user/kumz90hy8ufomdgof8ik.jpg'
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      defaultValue: 'Male',
      validate: {
        isIn: {
          args: [['Male', 'Female', 'Other']],
          msg: 'Must be Male, Female or Other'
        }
      }
    },
    dateOfBirth: DataTypes.DATE,
    role: {
      type: DataTypes.ENUM('Customer', 'Admin', 'Employee'),
      defaultValue: 'Customer',
      validate: {
        isIn: {
          args: [['Customer', 'Admin', 'Employee']],
          msg: 'Must be Customer, Employee or Admin'
        }
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'User',
    timestamps: false
  }
);

User.beforeSave(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(16);
    if (user.password) {
      user.password = await bcrypt.hash(user.password, salt);
    }
  }
});

export default User;
