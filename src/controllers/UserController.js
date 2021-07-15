const User = require('../models/User.js');
const Follow = require('../models/Following.js');
const Repo = require('../models/Repo.js');
const Star = require('../models/Star.js');
const { Op } = require('sequelize');
require('dotenv/config');

const UserController = {
    async create(request, response) {
        try {
            const exists = !!(await User.findOne({ where: { email: request.body.email } }));
            if (exists) return response.status(400).json({ message: 'Email já registrado' });
            await User.create({ avatarImgName: request.file.filename, ...request.body });
            return response.status(201).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async show(request, response) {
        try {
            const user = await User.findByPk(request.params.userId, {
                attributes: ['userId', 'username', 'name', 'email', 'local', 'bio', 'avatarImgName'],
                raw: true,
            });
            if (!user) return response.status(404).send();
            if (user.avatarImgName) {
                user.avatarUrl = `${process.URL || 'localhost'}:${process.env.PORT || 3031}/uploads/${
                    user.avatarImgName
                }`;
                delete user.avatarImgName;
            }

            const followerCount = await Follow.count({
                where: {
                    followingId: request.params.userId,
                },
            });

            const followingCount = await Follow.count({
                where: {
                    userId: request.params.userId,
                },
            });

            const starCount = await Star.count({
                where: {
                    userId: request.params.userId,
                },
            });

            const repoCount = await Repo.count({
                where: {
                    userId: request.params.userId,
                },
            });

            return response
                .status(200)
                .json({ data: { ...user, followerCount, followingCount, repoCount, starCount } });
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async update(request, response) {
        try {
            const exists = !(await User.findOne({ where: { userId: request.params.userId } }));
            if (exists) return response.status(400).json({ message: 'Usuário não encontrado' });
            await User.update(
                { avatarImgName: request.file.filename, ...request.body },
                { where: { userId: request.params.userId } },
            );
            return response.status(200).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async delete(request, response) {
        try {
            const exists = !(await User.findOne({ where: { userId: request.params.userId } }));
            if (exists) return response.status(400).json({ message: 'Usuário não encontrado' });
            await User.destroy({ where: { userId: request.params.userId } });
            return response.status(200).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async getFollowers(request, response) {
        try {
            //TODO retornar avatar
            const followers = Follow.findAll(
                { where: { followingId: request.params.userId } },
                { attributes: ['userId', 'username', 'avatarImgName'] },
            );
            return followers.length ? response.status(200).json({ data: { followers } }) : response.status(404).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async getFollowing(request, response) {
        try {
            //TODO retornar avatar
            const following = Follow.findAll(
                { where: { userId: request.params.userId } },
                { attributes: ['userId', 'username', 'avatarImgName'] },
            );
            return following.length ? response.status(200).json({ data: { following } }) : response.status(404).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async getStars(request, response) {
        try {
            const stars = Star.findAll({ where: { userId: request.params.userId } }, { attributes: ['repoId'] });
            //TODO
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async follow(request, response) {
        try {
            const userDontExist = !(await User.findOne({ where: { userId: request.params.userId } }));
            const followDontExist = !(await User.findOne({ where: { userId: request.params.followId } }));
            if (userDontExist || followDontExist)
                return response.status(400).json({ message: 'Usuário não encontrado' });
            const isFollowing = await Follow.findOne({
                where: {
                    [Op.and]: [{ userId: request.params.userId }, { followingId: request.params.followId }],
                },
            });
            if (isFollowing) return response.status(400).json({ message: 'A relação já existe' });
            await Follow.create({ userId: request.params.userId, followingId: request.params.followId });
            return response.status(201).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async unfollow(request, response) {
        try {
            //também pode ser executado usando o id da relação
            const userExists = await User.findOne({ where: { userId: request.params.userId } });
            const followExists = await User.findOne({ where: { userId: request.params.followId } });
            if (!userExists || !followExists) return response.status(400).json({ message: 'Usuário não encontrado' });
            const isNotFollowing = !(await Follow.findOne({
                where: { [Op.and]: [{ userId: request.params.userId }, { followingId: request.params.followId }] },
            }));
            if (isNotFollowing) return response.status(400).json({ message: 'A relação não existe' });
            await Follow.destroy({
                where: { [Op.and]: [{ userId: request.params.userId }, { followingId: request.params.followId }] },
            });
            return response.status(200).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
};

module.exports = UserController;
