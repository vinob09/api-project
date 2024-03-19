'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(
        models.User,
        {
          foreignKey: 'organizerId'
        }
      );
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 60]
      }
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [50, 255]
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isType(value) {
          if (value !== 'Online' || value !== 'In person') {
            throw new Error(`Type must be 'Online' or 'In person`)
          }
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        isBoolean(value) {
          if (value !== true || value !== false) {
            throw new Error('Private must be a boolean')
          }
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
