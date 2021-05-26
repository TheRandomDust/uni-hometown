const Hometown = require('./models/hometown');
const Review = require('./models/review');
const { hometownSchema, reviewSchema } = require('./schemas');
const AppError = require('./utils/AppError');

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		// store the url the user was trying to access
		req.session.returnToUrl = req.originalUrl;
		req.flash('error', 'You must be signed in!');
		return res.redirect('/login');		
	}
	next();
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const hometown = await Hometown.findById(id);
	if (!hometown.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that');
		return res.redirect(`/hometowns/${id}`);
	}
	next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that');
		return res.redirect(`/hometowns/${id}`);
	}
	next();
};

module.exports.validateHometown = (req, res, next) => {
	const { error } = hometownSchema.validate(req.body);
	if (error) {
		const errorMessage = error.details.map(el => el.message).join(', '); // make single string message from array of objects
		throw new AppError(errorMessage, 400);
	} else {
		next();
	}
};

module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const errorMessage = error.details.map(el => el.message).join(', '); // make single string message from array of objects
		throw new AppError(errorMessage, 400);
	} else {
		next();
	}
};