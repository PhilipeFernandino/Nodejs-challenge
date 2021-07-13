const express = require('express');
const { celebrate } = require('celebrate');
const router = express.Router();
const upload = require('multer')();
const UserController = require('./controllers/UserController.js');
const { userSchema } = require('./schema.js');

router.post('/user', upload.single('avatar'), celebrate(userSchema.create), UserController.create);
router.get('/user/:userId', UserController.get);

module.exports = router;
