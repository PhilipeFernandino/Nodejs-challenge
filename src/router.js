const express = require('express');
const { celebrate } = require('celebrate');
const multer = require('multer');
const multerConfig = require('./config/multer.js');
const UserController = require('./controllers/UserController.js');
const RepoController = require('./controllers/RepoController.js');
const { userSchema } = require('./schema.js');
const router = express.Router();
const upload = multer(multerConfig);

router.post('/user', upload.single('avatar'), celebrate(userSchema.create), UserController.create);
router.get('/user/:userId', UserController.show);
router.patch('/user/:userId', upload.single('avatar'), UserController.update);
router.get('/user/:userId/followers', UserController.getFollowers);
router.get('/user/:userId/following', UserController.getFollowing);
router.get('/user/:userId/stars', UserController.getStars);
router.post('/user/:userId/follow/:followId', UserController.follow);
router.delete('/user/:userId/unfollow/:followId', UserController.unfollow);
router.delete('/user/:userId', UserController.delete);

router.post('/user/:userId/repo', RepoController.create);
router.get('/user/:userId/repo', RepoController.index);
router.get('/repo/:username/:repoName', RepoController.show); //usando o slug para encontrar
router.get('/repo/:repoId', RepoController.show);
router.patch('/repo/:repoId', RepoController.update);
router.delete('/repo/:repoId', RepoController.delete);
//TODO
//dar estrela
//remover estrela
//validar as requests
//auth

module.exports = router;
