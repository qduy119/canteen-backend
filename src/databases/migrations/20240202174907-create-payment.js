'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payment', {
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
      orderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Order',
          key: 'id'
        }
      },
      payDate: Sequelize.DATE,
      bankCode: Sequelize.TEXT,
      cardType: Sequelize.TEXT,
      amount: Sequelize.FLOAT,
      status: {
        type: Sequelize.ENUM('Pending', 'Success', 'Cancel', 'Error'),
        defaultValue: 'Pending'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payment');
  }
};
