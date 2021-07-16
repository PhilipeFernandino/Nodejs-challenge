const User = require('../models/User.js');
const Follow = require('../models/Following.js');
const Repo = require('../models/Repo.js');
const Star = require('../models/Star.js');
const Token = require('../models/Token.js');
const { Op } = require('sequelize');
require('dotenv/config');

const UserController = {
    async create(request, response) {
        try {
            const exists = !!(await User.findOne({
                where: { [Op.or]: [{ email: request.body.email }, { username: request.body.username }] },
            }));
            if (exists) return response.status(400).json({ message: 'Credencial já registrada' });
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
            request.body.avatarImgName = request.file?.filename;
            await User.update({ ...request.body }, { where: { userId: request.params.userId } });
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
            const followers = await Follow.findAll({
                where: { followingId: request.params.userId },
                attributes: ['userId'],
                raw: true,
            });
            const users = await User.findAndCountAll({
                where: { userId: followers.map((follower) => parseInt(follower.userId)) },
            });
            return followers.length
                ? response.status(200).json({ data: { followers: users } })
                : response.status(404).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async getFollowing(request, response) {
        try {
            const following = await Follow.findAll({
                where: { userId: request.params.userId },
                attributes: ['followingId'],
                raw: true,
            });
            const users = await User.findAndCountAll({
                where: { userId: following.map((follower) => parseInt(follower.followingId)) },
            });
            return following.length
                ? response.status(200).json({ data: { following: users } })
                : response.status(404).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async getStars(request, response) {
        try {
            const stars = await Star.findAll({
                where: { userId: request.params.userId },
                attributes: ['repoId'],
                raw: true,
            });
            const repos = await Repo.findAll({
                where: { repoId: stars.map((star) => parseInt(star.repoId)) },
                attributes: ['name', 'description', 'isPublic'],
                raw: true,
            });
            return response.status(200).json({ data: { repos } });
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
    async auth(request, response) {
        try {
            const user = await User.findOne({
                where: { username: request.params.username },
                attributes: ['userId'],
                raw: true,
            });
            if (!user) return response.status(400).json({ message: 'Usuário não encontrado' });
            await Token.create({ userId: user.userId });
            return response.status(201).json({ userId: user.userId });
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
};

module.exports = UserController;
