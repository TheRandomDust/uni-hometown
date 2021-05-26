const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const AppError = require('../utils/AppError');
const wrapAsync = require('../utils/wrapAsync');

router.get('/signup', (req, res) => {
	res.render('users/signup');
});

router.post('/signup', wrapAsync(async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const user = new User({ username: username, email: email });
		const registeredUser = await User.register(user, password);	
		req.login(registeredUser, err => {
			if (err) return next(err);
			req.flash('success', 'Created new user!');
			res.redirect('/hometowns');
		});
		
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('/signup');
	}
}));

router.get('/login', (req, res) => {
	res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async (req, res) => {
	req.flash('success', 'Welcome back!');
	const redirectUrl = req.session.returnToUrl || '/hometowns';
	delete req.session.returnToUrl;
	res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Bye!');
	res.redirect('/hometowns');
});

module.exports = router;