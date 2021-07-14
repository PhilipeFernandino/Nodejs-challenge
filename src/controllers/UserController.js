const User = require('../models/User.js');
require('dotenv/config');

const UserController = {
    async create(request, response) {
        try {
            await User.create({ avatarImgName: request.file.filename, ...request.body });
            return response.status(201).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async get(request, response) {
        try {
            const user = await User.findByPk(request.params.userId, { raw: true });
            if (!user) return response.status(404).send();
            if (user.avatarImgName) {
                user.avatarUrl = `${process.URL || 'localhost'}:${process.env.PORT || 3031}/uploads/${
                    user.avatarImgName
                }`;
                delete user.avatarImgName;
            }
            return response.status(200).json({ ...user });
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
};

module.exports = UserController;
