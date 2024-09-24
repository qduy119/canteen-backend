'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Review', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      orderItemId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'OrderItem',
          key: 'id'
        }
      },
      userId: {
        type: Sequelize.STRING,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      rating: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      description: Sequelize.TEXT,
      images: Sequelize.JSON,
      createAt: Sequelize.DATE
    });
    await queryInterface.addConstraint('Review', {
      name: 'check_rating',
      fields: ['rating'],
      type: 'check',
      where: {
        rating: {
          [Sequelize.Op.lte]: 5
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Review', 'check_rating');
    await queryInterface.dropTable('Review');
  }
};
