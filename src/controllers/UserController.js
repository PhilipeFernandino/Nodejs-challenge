const User = require('../models/User.js');

const UserController = {
    async create(request, response) {
        try {
            console.log(request.body);
            console.log(request.file, request.files);
            await User.create({ avatar: request.file.buffer, ...request.body });
            return response.status(201).send();
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
    async get(request, response) {
        try {
            console.log(request.params);
            const user = User.findOne({ where: { userId: request.params.userId } });
            return response.status(200).json({ user });
        } catch (error) {
            console.log(error);
            return response.status(500).send();
        }
    },
};

module.exports = UserController;
