const Sequelize = require('sequelize');
const database = require('../../db.js');

const Following = database.define(
    'following',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'userId',
            },
        },
        followingId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            onDelete: 'CASCADE',
            references: {
                model: 'user',
                key: 'userId',
            },
        },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['userId', 'followingId'],
            },
        ],
    },
);

module.exports = Following;
