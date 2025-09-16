'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    // Add Otp and otp expires fields 

    await queryInterface.addColumn("users", "otp", {
      type: Sequelize.STRING,
      allowNull: true
    })

    await queryInterface.addColumn("users", "otpExpires", {
      type: Sequelize.DATE,
      allowNull: true
    })


  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "otp")

    await queryInterface.removeColumn("users", "otpExpires")
  }
};
