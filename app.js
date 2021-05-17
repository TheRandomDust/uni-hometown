const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Hometown = require('./models/hometown');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const morgan = require('morgan'); // TODO maybe remove later
const AppError = require('./utils/AppError');
const wrapAsync = require('./utils/wrapAsync');

// config db and connect
mongoose.connect('mongodb://localhost:27017/hometowns', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected on port 27017');
});

const app = express();

// set the engine to ejs and normalize path
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/**
 * middleware
 */
app.use(express.urlencoded({ extended: true })); // middleware to be able to parse key-value pairs from the request body, by default it's undefined
app.use(methodOverride('_method')); // to use query param to override forms to delete / put / patch
app.use(morgan('dev')); // TODO maybe remove later

/**
 * routes
 */
app.get('/', (req, res) => {
	res.render('home');
});


app.get('/hometowns', wrapAsync(async (req, res) => { 
	const hometowns = await Hometown.find({});
	res.render('hometowns/index', { hometowns });
}));

app.get('/hometowns/new', (req, res) => {
	res.render('hometowns/new');
});

app.post('/hometowns', wrapAsync(async (req, res) => {
	const hometown = new Hometown(req.body.hometown);
	await hometown.save();
	res.redirect(`/hometowns/${hometown._id}`);
}));

app.get('/hometowns/:id', wrapAsync(async (req, res) => {
	const hometown = await Hometown.findById(req.params.id);
	res.render('hometowns/show', { hometown });
}));

app.get('/hometowns/:id/edit', wrapAsync(async (req, res) => {
	const hometown = await Hometown.findById(req.params.id);
	res.render('hometowns/edit', { hometown });
}));

app.put('/hometowns/:id', wrapAsync(async (req, res) => {
	const { id } = req.params;
	const hometown = await Hometown.findByIdAndUpdate(id, { ...req.body.hometown }, { runValidators: true, new: true });
	res.redirect(`/hometowns/${hometown._id}`);
}));

app.delete('/hometowns/:id', wrapAsync(async (req, res) => {
	const { id } = req.params;
	await Hometown.findByIdAndDelete(id);
	res.redirect('/hometowns');
}));

// error handling middleware
app.use((err, req, res, next) => {
	const { status = 500, message = 'Something went wrong' } = err;
	res.status(status).send(message);
});


app.listen(3000, () => {
	console.log('Express serving on port 3000');
});