'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Item', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Category',
          key: 'id'
        }
      },
      thumbnail: Sequelize.TEXT,
      name: Sequelize.TEXT,
      description: Sequelize.TEXT,
      price: Sequelize.FLOAT,
      discount: Sequelize.FLOAT,
      stock: Sequelize.INTEGER,
      images: Sequelize.JSON,
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      }
    });
    await queryInterface.addConstraint('Item', {
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
    await queryInterface.removeConstraint('Item', 'check_rating');
    await queryInterface.dropTable('Item');
  }
};
