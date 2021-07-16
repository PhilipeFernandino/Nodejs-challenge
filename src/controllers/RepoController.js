const User = require('../models/User.js');
const Repo = require('../models/Repo.js');
const Star = require('../models/Star.js');
const { Op } = require('sequelize');
require('dotenv/config');

const UserController = {
    async create(request, response) {
        try {
            const user = await User.findOne({ where: { userId: request.params.userId }, attributes: ['username'] });
            if (!user) return response.status(400).json({ message: 'Usuário não encontrado' });
            const exists = !!(await Repo.findOne({
                where: { [Op.and]: [{ userId: request.params.userId }, { name: request.body.name }] },
            }));
            if (exists) return response.status(400).json({ message: 'Nome já está em uso' });
            await Repo.create({
                userId: request.params.userId,
                slug: user.username + '/' + request.body.name,
                ...request.body,
            });
            return response.status(201).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async index(request, response) {
        try {
            const repos = await Repo.findAndCountAll({
                where: { userId: request.params.userId },
                attributes: ['repoId', 'name', 'isPublic', 'description'],
            });
            return repos.count
                ? response.status(200).json({ data: { repos: repos.rows, count: repos.count } })
                : response.status(404).send();
        } catch (error) {}
    },
    async show(request, response) {
        try {
            const where =
                request.params.username && request.params.repoName
                    ? { slug: request.params.username + '/' + request.params.repoName }
                    : { repoId: request.params.repoId };
            const repo = await Repo.findOne({
                where,
                raw: true,
                attributes: ['repoId', 'name', 'isPublic', 'description'],
            });
            repo.stars = await Star.count({ where: { repoId: repo.repoId } });
            return repo ? response.status(200).json({ data: { repo } }) : response.status(404).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async update(request, response) {
        try {
            const repo = await Repo.findOne({ where: { repoId: request.params.repoId } });
            if (!repo) return response.status(400).json({ message: 'Repositório não encontrado' });
            await Repo.update({ ...request.body }, { where: { repoId: request.params.repoId } });
            return response.status(200).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async delete(request, response) {
        try {
            const repo = await Repo.findOne({ where: { repoId: request.params.repoId } });
            if (!repo) return response.status(400).json({ message: 'Repositório não encontrado' });
            await Repo.destroy({ where: { repoId: request.params.repoId } });
            return response.status(200).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async star(request, response) {
        try {
            if (!(await User.findOne({ where: { userId: request.params.userId } })))
                return response.status(400).json({ message: 'Usuário não encontrado' });

            if (!(await Repo.findOne({ where: { repoId: request.params.repoId } })))
                return response.status(400).json({ message: 'Repositório não encontrado' });

            if (
                await Star.findOne({
                    where: { [Op.and]: [{ userId: request.params.userId }, { repoId: request.params.repoId }] },
                })
            )
                return response.status(400).json({ message: 'A relação já existe' });

            await Star.create({ userId: request.params.userId, repoId: request.params.repoId });
            return response.status(201).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async unstar(request, response) {
        try {
            if (!(await User.findOne({ where: { userId: request.params.userId } })))
                return response.status(400).json({ message: 'Usuário não encontrado' });

            if (!(await Repo.findOne({ where: { repoId: request.params.repoId } })))
                return response.status(400).json({ message: 'Repositório não encontrado' });

            if (
                !(await Star.findOne({
                    where: {
                        [Op.and]: [{ userId: request.params.userId }, { repoId: request.params.repoId }],
                    },
                }))
            )
                return response.status(400).json({ message: 'A relação não existe' });

            await Star.destroy({
                where: { [Op.and]: [{ userId: request.params.userId }, { repoId: request.params.repoId }] },
            });
            return response.status(201).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
};

module.exports = UserController;
