'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      email: Sequelize.TEXT,
      password: Sequelize.TEXT,
      provider: {
        type: Sequelize.ENUM('google', 'github', 'default'),
        defaultValue: 'default'
      },
      phoneNumber: Sequelize.TEXT,
      fullName: Sequelize.TEXT,
      avatar: {
        type: Sequelize.TEXT,
        defaultValue:
          'https://res.cloudinary.com/dlzyiprib/image/upload/v1694617729/e-commerces/user/kumz90hy8ufomdgof8ik.jpg'
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Other'),
        defaultValue: 'Male',
      },
      dateOfBirth: Sequelize.DATE,
      role: {
        type: Sequelize.ENUM('Customer', 'Admin', 'Employee'),
        defaultValue: 'Customer',
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('User');
  }
};
