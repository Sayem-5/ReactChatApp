const express = require('express');
const catchAsync = require('../utils/catchAsync');
const userController = require('../controllers/users');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });

const router = express.Router();

router.get('/register', userController.renderRegister);

router.post('/register', catchAsync(userController.createUser));

router.get('/login', userController.renderLogin);

router.post('/logout', isLoggedIn , userController.userLogout);

//router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }), catchAsync(userController.userLogin));

router.post('/profile', isLoggedIn, upload.single('profilePicture') , catchAsync(userController.uploadProfilePicture));

router.post('/login', (req, res, next) => {
    console.log("In Login route");
    console.log("Detailss: ", req.body);
    passport.authenticate('local', (err, user, info) => {
        console.log("In pass auth", err, user, info);
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.status(200).json({ message: 'Authentication successful' });
      });
    })(req, res, next);
});

router.get('/search', catchAsync(userController.userSearch));

//router.get('/test', userController.test);

module.exports = router;