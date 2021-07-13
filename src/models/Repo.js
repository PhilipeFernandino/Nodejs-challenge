const Sequelize = require('sequelize');
const database = require('../../db.js');

const Repo = database.define('repo', {
    repoId: {
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
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    isPublic: {
        type: Sequelize.BOOLEAN,
        default: true,
        allowNull: false,
    },
});

module.exports = Repo;
