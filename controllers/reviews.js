const Hometown = require('../models/hometown');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
	const hometown = await Hometown.findById(req.params.id);
	const review = new Review(req.body.review);
	review.author = req.user._id;
	hometown.reviews.push(review);
	await review.save();
	await hometown.save();
	req.flash('success', 'Created new review!');
	res.redirect(`/hometowns/${hometown._id}`);
};

module.exports.deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	await Hometown.findByIdAndUpdate(id, { $pull: {reviews: reviewId }}); // $pull removes something from array pretty much, array of ObjectId's in this case
	await Review.findByIdAndDelete(reviewId);
	req.flash('warn', 'Deleted review!');
	res.redirect(`/hometowns/${id}`);
};