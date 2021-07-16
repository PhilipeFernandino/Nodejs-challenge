const Sequelize = require('sequelize');
const database = require('../../db.js');

const User = database.define('user', {
    userId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    avatarImgName: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    bio: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    local: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});

module.exports = User;
