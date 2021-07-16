const Sequelize = require('sequelize');
const database = require('../../db.js');

const Star = database.define(
    'star',
    {
        starId: {
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
        repoId: {
            type: Sequelize.STRING,
            allowNull: false,
            onDelete: 'CASCADE',
            references: {
                model: 'repos',
                key: 'repoId',
            },
        },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['userId', 'repoId'],
            },
        ],
    },
);

module.exports = Star;
