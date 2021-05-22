const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	}
});

// this adds onto our schema a user and password, and make sure usernames are unique and other functionality
UserSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model('User', UserSchema);