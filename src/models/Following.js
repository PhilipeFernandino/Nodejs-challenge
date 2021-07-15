const Sequelize = require('sequelize');
const database = require('../../db.js');

const Follow = database.define(
    'follow',
    {
        followId: {
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
        followingId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            onDelete: 'CASCADE',
            references: {
                model: 'users',
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

module.exports = Follow;
