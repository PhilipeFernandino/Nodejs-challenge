const { Joi } = require('celebrate');

const userSchema = {
    create: {
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            username: Joi.string()
                .pattern(/^[^\-](?!.*--)([A-Za-z0-9\-]{1,40}$)/)
                .min(2)
                .max(40)
                .required(),
            avatar: Joi.any(),
            bio: Joi.string(),
            local: Joi.string(),
        }),
    },
    update: {
        params: Joi.object().keys({
            userId: Joi.number().integer().required(),
        }),
        body: Joi.object().keys({
            name: Joi.string().required(),
            avatar: Joi.any(),
            bio: Joi.string(),
            local: Joi.string(),
        }),
    },
    usernameInParam: {
        params: Joi.object().keys({
            username: Joi.string().required(), // não é de fato necessário adicionar o required, já que a request só será direcionada para a rota se
        }), // o userId estiver nos parâmetros. adicionado para fins de legibilidade
    },
    idInParam: {
        params: Joi.object().keys({
            userId: Joi.number().integer().required(),
        }),
    },
    idAndFidInParam: {
        params: Joi.object().keys({
            userId: Joi.number().integer().required(),
            followId: Joi.number().integer().required(),
        }),
    },
};

const mixedSchema = {
    userIdAndRepoIdInParam: {
        params: Joi.object().keys({
            userId: Joi.number().integer().required(),
            repoId: Joi.number().integer().required(),
        }),
    },
    usernameAndRepoNameInParam: {
        params: Joi.object().keys({
            username: Joi.string().required(),
            repoName: Joi.string().required(),
        }),
    },
};

const repoSchema = {
    create: {
        params: Joi.object().keys({
            userId: Joi.number().integer().required(),
        }),
        body: Joi.object().keys({
            name: Joi.string()
                .pattern(/^([A-Za-z0-9\-]{1,40}$)/)
                .required(),
            description: Joi.string(),
            isPublic: Joi.boolean(),
        }),
    },
    update: {
        params: Joi.object().keys({
            repoId: Joi.number().integer().required(),
        }),
        body: Joi.object().keys({
            name: Joi.string()
                .pattern(/^([A-Za-z0-9\-]{1,40}$)/)
                .required(),
            description: Joi.string(),
            isPublic: Joi.boolean(),
        }),
    },
    idInParam: {
        params: Joi.object().keys({
            repoId: Joi.number().integer().required(),
        }),
    },
};
module.exports = {
    userSchema,
    mixedSchema,
    repoSchema,
};
