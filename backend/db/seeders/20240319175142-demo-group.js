'use strict';

const { Group } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Group.bulkCreate([
      {
        organizerId: 1,
        name: "Journey to Mordor",
        about: "Accompany our group into the dark lands of Mordor. Meals to be gathered along the way, rest will be provided around a campfire. All classes welcome, whether you be elf, dwarf or man!",
        type: "In person",
        private: true,
        city: "Rivendell",
        state: "Middle-earth"
      },
      {
        organizerId: 2,
        name: "Tavern Hopping Across Faerûn",
        about: "Enjoy unique ales and gather around for a merry time, singing and dancing across the many taverns in Faerûn.",
        type: "In person",
        private: false,
        city: "Baldur's Gate",
        state: "Faerûn"
      },
      {
        organizerId: 3,
        name: "Monsters and Beasts Abound",
        about: "Chat with seasoned Witchers about various beasts and gain knowledge on various herbs for potion making. Discussion to be held via Magic Mirrors.",
        type: "Online",
        private: true,
        city: "Vizima",
        state: "Temeria"
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Journey to Mordor', 'Tavern Hopping Across Faerûn', 'Monsters and Beasts Abound'] }
    }, {});
  }
};
