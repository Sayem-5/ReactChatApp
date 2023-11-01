const express = require('express');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const chatsController = require('../controllers/chats');

const router = express.Router();

router.get('/', isLoggedIn, catchAsync(chatsController.index));

router.get('/new', isLoggedIn, catchAsync(chatsController.renderNewChat));

router.post('/new', isLoggedIn, catchAsync(chatsController.createNewChat));

router.get('/:id', isLoggedIn , catchAsync(chatsController.renderChat));

router.delete('/delete', isLoggedIn, catchAsync(chatsController.deteleChat));

module.exports = router;