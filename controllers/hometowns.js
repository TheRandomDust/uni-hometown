const Hometown = require('../models/hometown');

module.exports.index = async (req, res) => { 
	const hometowns = await Hometown.find({});
	res.render('hometowns/index', { hometowns });
};

module.exports.renderNewForm = (req, res) => {
	res.render('hometowns/new');
};

module.exports.createHometown = async (req, res) => {
	const hometown = new Hometown(req.body.hometown);
	hometown.author = req.user._id;
	await hometown.save();
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
	await Hometown.findByIdAndUpdate(id, { ...req.body.hometown }, { runValidators: true, new: true });
	req.flash('success', 'Successfully updated hometown!');
	res.redirect(`/hometowns/${id}`);
};

module.exports.deleteHometown = async (req, res) => {
	const { id } = req.params;
	await Hometown.findByIdAndDelete(id);
	req.flash('warn', 'Deleted hometown!');
	res.redirect('/hometowns');
}