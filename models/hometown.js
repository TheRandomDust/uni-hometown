const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const HometownSchema = new Schema({
	town: String,
	milesFromUni: {
		type: Number,
		min: 0
	},
	description: String,
	extraCoolThings: String,
	location: String,
	images: [String],
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
});

HometownSchema.post('findOneAndDelete', async function(doc) {
	// when hometown is deleted using findByIdAndDelete, this is called to delete all child 'reviews' with mongoose middleware
	// basically you can do pre/post functions, this is a query middleware
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews
			}
		})
	}
})

module.exports = mongoose.model('Hometown', HometownSchema);