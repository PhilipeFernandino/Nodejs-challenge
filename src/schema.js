const { Joi } = require('celebrate');

const userSchema = {
    create: {
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            username: Joi.string().required(),
            avatar: Joi.any(),
            bio: Joi.string(),
            local: Joi.string(),
        }),
    },
};

module.exports = {
    userSchema,
};
