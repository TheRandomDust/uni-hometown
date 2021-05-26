const User = require('../models/user');

module.exports.renderSignupForm = (req, res) => {
	res.render('users/signup');
};

module.exports.signup = async (req, res) => {
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
};

module.exports.renderLoginForm = (req, res) => {
	res.render('users/login');
};

module.exports.login = async (req, res) => {
	req.flash('success', 'Welcome back!');
	const redirectUrl = req.session.returnToUrl || '/hometowns';
	delete req.session.returnToUrl;
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'Bye!');
	res.redirect('/hometowns');
};