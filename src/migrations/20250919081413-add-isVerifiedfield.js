'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    //Add isverfied field to check users that have verified their accounts
    await queryInterface.addColumn("users","isVerified",{
      type:Sequelize.BOOLEAN,
      defaultValue:false,
      allowNull:false
    })
  },

  async down (queryInterface, Sequelize) {
  
    await queryInterface.removeColumn("users","isVerified")
  }
};
