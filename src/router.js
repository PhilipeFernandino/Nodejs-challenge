const express = require('express');
const { celebrate } = require('celebrate');
const multer = require('multer');
const multerConfig = require('./config/multer.js');
const UserController = require('./controllers/UserController.js');
const RepoController = require('./controllers/RepoController.js');
const { userSchema, mixedSchema, repoSchema } = require('./schema.js');
const router = express.Router();
const upload = multer(multerConfig);

//celebrate é um wrapper que usa o joi para validar os campos passados na request (seja em params, body ou query)
router.post('/user', upload.single('avatar'), celebrate(userSchema.create), UserController.create);
router.post('/user/:username/auth', celebrate(userSchema.usernameInParam), UserController.auth);
router.get('/user/:userId', celebrate(userSchema.idInParam), UserController.show);
router.patch('/user/:userId', upload.single('avatar'), celebrate(userSchema.update), UserController.update);
router.get('/user/:userId/followers', celebrate(userSchema.idInParam), UserController.getFollowers);
router.get('/user/:userId/following', celebrate(userSchema.idInParam), UserController.getFollowing);
router.get('/user/:userId/stars', celebrate(userSchema.idInParam), UserController.getStars);
router.post('/user/:userId/follow/:followId', celebrate(userSchema.idAndFidInParam), UserController.follow);
router.delete('/user/:userId/unfollow/:followId', celebrate(userSchema.idAndFidInParam), UserController.unfollow);
router.delete('/user/:userId', celebrate(userSchema.idInParam), UserController.delete);

router.post('/user/:userId/repo', celebrate(repoSchema.create), RepoController.create);
router.get('/user/:userId/repo', celebrate(userSchema.idInParam), RepoController.index);
router.get('/repo/:username/:repoName', celebrate(mixedSchema.usernameAndRepoNameInParam), RepoController.show); //usando o slug para encontrar
router.get('/repo/:repoId', celebrate(repoSchema.idInParam), RepoController.show);
router.patch('/repo/:repoId', celebrate(repoSchema.update), RepoController.update);
router.delete('/repo/:repoId', celebrate(repoSchema.idInParam), RepoController.delete);
router.post('/user/:userId/star/:repoId', celebrate(mixedSchema.userIdAndRepoIdInParam), RepoController.star);
router.delete('/user/:userId/unstar/:repoId', celebrate(mixedSchema.userIdAndRepoIdInParam), RepoController.unstar);

module.exports = router;
