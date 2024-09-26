'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Coupon', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.TEXT
      },
      title: Sequelize.TEXT,
      discountPercentage: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      expirationDate: Sequelize.DATE,
      usedQuantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      usageLimit: {
        type: Sequelize.INTEGER,
        defaultValue: 10
      }
    });
    await queryInterface.addConstraint('Coupon', {
      name: 'check_discount_percentage',
      fields: ['discountPercentage'],
      type: 'check',
      where: {
        discountPercentage: {
          [Sequelize.Op.gte]: 0
        }
      }
    });
    await queryInterface.addConstraint('Coupon', {
      name: 'check_usage_limit',
      fields: ['usageLimit'],
      type: 'check',
      where: {
        usageLimit: {
          [Sequelize.Op.gte]: 1
        }
      }
    });
    await queryInterface.addConstraint('Coupon', {
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
    await queryInterface.removeConstraint('Coupon', 'check_usage_limit');
    await queryInterface.removeConstraint(
      'Coupon',
      'check_discount_percentage'
    );
    await queryInterface.removeConstraint('Coupon', 'check_expiration_date');
    await queryInterface.dropTable('Coupon');
  }
};
