const express = require('express');
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const groupsController = require('../controllers/groups');
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });

const router = express.Router();

router.get('/', isLoggedIn, catchAsync(groupsController.renderGroups));

router.get('/new', isLoggedIn , catchAsync(groupsController.renderCreateGroup));

router.post('/new', isLoggedIn, catchAsync(groupsController.createGroup));

router.get('/:id', isLoggedIn, catchAsync(groupsController.renderAGroup));

router.delete('/delete', isLoggedIn, catchAsync(groupsController.leaveGroup));

router.post('/icon', isLoggedIn, upload.single('groupIcon') , catchAsync(groupsController.uploadGroupIcon));

module.exports = router;