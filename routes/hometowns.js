const express = require('express');
const router = express.Router();
const Hometown = require('../models/hometown');
const { hometownSchema } = require('../schemas');
const AppError = require('../utils/AppError');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn } = require('../middleware');

const validateHometown = (req, res, next) => {
	const { error } = hometownSchema.validate(req.body);
	if (error) {
		const errorMessage = error.details.map(el => el.message).join(', '); // make single string message from array of objects
		throw new AppError(errorMessage, 400);
	} else {
		next();
	}
}

router.get('/', wrapAsync(async (req, res) => { 
	const hometowns = await Hometown.find({});
	res.render('hometowns/index', { hometowns });
}));

router.get('/new', isLoggedIn, (req, res) => {
	res.render('hometowns/new');
});

router.post('/', isLoggedIn, validateHometown, wrapAsync(async (req, res) => {
	const hometown = new Hometown(req.body.hometown);
	await hometown.save();
	req.flash('success', 'Successfully saved new hometown!');
	res.redirect(`/hometowns/${hometown._id}`);
}));

router.get('/:id', isLoggedIn, wrapAsync(async (req, res) => {
	const hometown = await Hometown.findById(req.params.id).populate('reviews');
	res.render('hometowns/show', { hometown });
}));

router.get('/:id/edit', isLoggedIn, wrapAsync(async (req, res) => {
	const hometown = await Hometown.findById(req.params.id);
	res.render('hometowns/edit', { hometown });
}));

router.put('/:id', isLoggedIn, validateHometown, wrapAsync(async (req, res) => {
	const { id } = req.params;
	const hometown = await Hometown.findByIdAndUpdate(id, { ...req.body.hometown }, { runValidators: true, new: true });
	req.flash('success', 'Successfully updated hometown!');
	res.redirect(`/hometowns/${hometown._id}`);
}));

router.delete('/:id', wrapAsync(async (req, res) => {
	const { id } = req.params;
	await Hometown.findByIdAndDelete(id);
	req.flash('warn', 'Deleted hometown!');
	res.redirect('/hometowns');
}));

module.exports = router;