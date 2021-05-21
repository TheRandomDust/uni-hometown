const express = require('express');
const router = express.Router({ mergeParams: true }); // merge params between routes and files calling this router (app.js)
const Hometown = require('../models/hometown');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas');
const AppError = require('../utils/AppError');
const wrapAsync = require('../utils/wrapAsync');

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const errorMessage = error.details.map(el => el.message).join(', '); // make single string message from array of objects
		throw new AppError(errorMessage, 400);
	} else {
		next();
	}
}

router.post('/', validateReview, wrapAsync(async (req, res) => {
	const hometown = await Hometown.findById(req.params.id);
	const review = new Review(req.body.review);
	hometown.reviews.push(review);
	await review.save();
	await hometown.save();
	req.flash('success', 'Created new review!');
	res.redirect(`/hometowns/${hometown._id}`);
}));

router.delete('/:reviewId', wrapAsync(async (req, res) => {
	const { id, reviewId } = req.params;
	await Hometown.findByIdAndUpdate(id, { $pull: {reviews: reviewId }}); // $pull removes something from array pretty much, array of ObjectId's in this case
	await Review.findByIdAndDelete(reviewId);
	req.flash('warn', 'Deleted review!');
	res.redirect(`/hometowns/${id}`);
}));

module.exports = router;