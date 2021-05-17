const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HometownSchema = new Schema({
	town: String,
	milesFromUni: Number,
	description: String,
	extraCoolThings: String,
	// location: String,
	images: [String]
});

module.exports = mongoose.model('Hometown', HometownSchema);