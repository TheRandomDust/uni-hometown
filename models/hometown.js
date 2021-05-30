const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const opts = { toJSON: { virtuals: true } }; // so that JSON.stringify also sends virtuals (for the map cluster 'properties')

const HometownSchema = new Schema({
	town: String,
	milesFromUni: {
		type: Number,
		min: 0
	},
	description: String,
	extraCoolThings: String,
	geometry: {
		type: {
			type: String,
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	images: [ 
		{
			url: String,
			filename: String
		}
	],
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
}, opts);

HometownSchema.virtual('properties._id').get(function () {
	return this._id;
});

HometownSchema.virtual('properties.town').get(function () {
	return this.town;
});

HometownSchema.virtual('properties.description').get(function () {
	return this.description;
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