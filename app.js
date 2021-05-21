const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const wrapAsync = require('./utils/wrapAsync');
const hometowns = require('./routes/hometowns');
const reviews = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');

// config db and connect
mongoose.connect('mongodb://localhost:27017/hometowns', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
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
const sessionConfig = {
	secret: 'tempsecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}
app.use(session(sessionConfig));
app.use(express.urlencoded({ extended: true })); // middleware to be able to parse key-value pairs from the request body, by default it's undefined
app.use(methodOverride('_method')); // to use query param to override forms to delete / put / patch
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.warn = req.flash('warn');
	res.locals.error = req.flash('error');
	next();
})

app.use('/hometowns', hometowns);
app.use('/hometowns/:id/reviews', reviews);

/**
 * routes
 */


app.get('/', (req, res) => {
	res.render('home');
});

app.all('*', (req, res, next) => {
	next(new AppError('Page not found', 404));
});

// error handling middleware
app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) err.message = 'Sorry, something went wrong!';
	res.status(status).render('error', { err });
});


app.listen(3000, () => {
	console.log('Express serving on port 3000');
});