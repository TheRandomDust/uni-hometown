const Joi = require('joi');

module.exports.hometownSchema = Joi.object({
	hometown: Joi.object({
		town: Joi.string().required(),
		milesFromUni: Joi.number().required().min(0),
		description: Joi.string().required(),
		extraCoolThings: Joi.string().required(),
		images: Joi.string()
	}).required()
});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().required().min(1).max(5),
		body: Joi.string().required()
	}).required()
});