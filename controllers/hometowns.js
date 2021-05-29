const Hometown = require('../models/hometown');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');
const mapboxgl = require('mapbox-gl');
mapboxgl.accessToken = mapBoxToken;

module.exports.index = async (req, res) => { 
	const hometowns = await Hometown.find({});
	res.render('hometowns/index', { hometowns });
};

module.exports.renderNewForm = (req, res) => {
	res.render('hometowns/new');
};

module.exports.createHometown = async (req, res) => {
	const geoData = await geocoder.forwardGeocode({
		query: req.body.hometown.town,
		limit: 1
	}).send();

	const hometown = new Hometown(req.body.hometown);
	hometown.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
	hometown.author = req.user._id;	
	hometown.geometry = geoData.body.features[0].geometry;
	await hometown.save();
	console.log(hometown);
	req.flash('success', 'Successfully saved new hometown!');
	res.redirect(`/hometowns/${hometown._id}`);
};

module.exports.showHometown = async (req, res) => {
	const hometown = await Hometown.findById(req.params.id).populate({
		// to populate reviews and author of each review
		path: 'reviews',
		populate: {
			path: 'author'
		}
	}).populate('author'); // and author of hometown
	// console.log(hometown)
	res.render('hometowns/show', { hometown });
};

module.exports.renderEditForm = async (req, res) => {
	const hometown = await Hometown.findById(req.params.id);
	if (!hometown) {
		req.flash('error', 'Cannot find that hometown');
		return res.redirect(`/hometowns`);
	}
	res.render('hometowns/edit', { hometown });
};

module.exports.updateHometown = async (req, res) => {
	const { id } = req.params;
	const hometown = await Hometown.findByIdAndUpdate(id, { ...req.body.hometown }, { runValidators: true, new: true });
	const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
	hometown.images.push(...images);
	await hometown.save();
	if (req.body.deleteImages) {
		// if deleteImages array (coming from the checkboxes of the form) has filenames, delete that image from mongo and cloudinary
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await hometown.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}});
	}
	
	req.flash('success', 'Successfully updated hometown!');
	res.redirect(`/hometowns/${id}`);
};

module.exports.deleteHometown = async (req, res) => {
	// TODO should also delete images from cloudinary here
	const { id } = req.params;
	await Hometown.findByIdAndDelete(id);
	req.flash('warn', 'Deleted hometown!');
	res.redirect('/hometowns');
}