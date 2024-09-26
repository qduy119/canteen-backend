'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Token', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      expirationDate: Sequelize.DATE
    });
    await queryInterface.addConstraint('Token', {
      name: 'check_expiration_date',
      fields: ['expirationDate'],
      type: 'check',
      where: {
        expirationDate: {
          [Sequelize.Op.gt]: new Date()
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Token', 'check_expiration_date');
    await queryInterface.dropTable('Token');
  }
};
