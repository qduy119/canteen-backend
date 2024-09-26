'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SeatReservation', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Order',
          key: 'id'
        }
      },
      seatNumber: Sequelize.INTEGER
    });
    await queryInterface.addConstraint('SeatReservation', {
      name: 'check_seat_number',
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
    await queryInterface.removeConstraint(
      'SeatReservation',
      'check_seat_number'
    );
    await queryInterface.dropTable('SeatReservation');
  }
};
