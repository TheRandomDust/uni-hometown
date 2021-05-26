const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const usersCtrl = require('../controllers/users');

router.route('/signup')
	.get(usersCtrl.renderSignupForm)
	.post(wrapAsync(usersCtrl.signup));

router.route('/login')
	.get(usersCtrl.renderLoginForm)
	.post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usersCtrl.login);

router.get('/logout', usersCtrl.logout);

module.exports = router;