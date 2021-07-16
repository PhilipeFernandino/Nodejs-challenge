const Sequelize = require('sequelize');
const database = require('../../db.js');

const Token = database.define('token', {
    tokenId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
            model: 'users',
            key: 'userId',
        },
    },
});

module.exports = Token;
