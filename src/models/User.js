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
    avatar: {
        type: Sequelize.BLOB('long'),
        allowNull: true,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
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
