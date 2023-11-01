const express = require('express');
const catchAsync = require('../utils/catchAsync');
const friendsController = require('../controllers/friends');
const { isLoggedIn } = require('../middleware')

const router = express.Router();

router.post('/add', isLoggedIn, catchAsync(friendsController.addFriend));

router.delete('/remove', isLoggedIn, catchAsync(friendsController.removeFriend));

router.post('/block', isLoggedIn, catchAsync(friendsController.blockFriend));

module.exports = router;