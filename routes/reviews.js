const express = require('express');
const router = express.Router({ mergeParams: true }); // merge params between routes and files calling this router (app.js)
const wrapAsync = require('../utils/wrapAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const reviewsCtrl = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, wrapAsync(reviewsCtrl.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewsCtrl.deleteReview));

module.exports = router;