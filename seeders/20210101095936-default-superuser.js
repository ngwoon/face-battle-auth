'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */
        await queryInterface.bulkInsert("question", [{
                title: "태어난 출생지는?"
            }, {
                title: "다녔던 초등학교 이름은?", 
            }, {
                title: "다녔던 중학교 이름은?",
            }, {
                title: "어머니의 성함은?",
            }, {
                title: "나의 보물 1호는?",
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */  
    }
};
