'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Order', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.STRING,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      orderDate: Sequelize.DATE,
      couponCode: Sequelize.TEXT,
      couponTitle: Sequelize.TEXT,
      discountPercentage: Sequelize.FLOAT,
      total: Sequelize.FLOAT,
      seatNumber: Sequelize.INTEGER,
      status: {
        type: Sequelize.ENUM('Pending', 'Success', 'Cancel', 'Error'),
        defaultValue: 'Pending'
      }
    });
    await queryInterface.addConstraint('Order', {
      name: 'check_seat_number_1',
      fields: ['seatNumber'],
      type: 'check',
      where: {
        seatNumber: {
          [Sequelize.Op.lte]: 20
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Order', 'check_seat_number_1');
    await queryInterface.dropTable('Order');
  }
};
