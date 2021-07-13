const Sequelize = require('sequelize');
const database = require('../../db.js');

const Star = database.define(
    'star',
    {
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'userId',
            },
        },
        repoId: {
            type: Sequelize.STRING,
            allowNull: false,
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
