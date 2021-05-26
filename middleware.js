module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		// store the url the user was trying to access
		req.session.returnToUrl = req.originalUrl;
		req.flash('error', 'You must be signed in!');
		return res.redirect('/login');		
	}
	next();
};