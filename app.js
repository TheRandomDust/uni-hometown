if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const hometownRoutes = require('./routes/hometowns');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

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

app.use(passport.initialize());
app.use(passport.session());
// use local strategy and use the authenticate method from passportLocalMongoose
passport.use(new LocalStrategy(User.authenticate()));
// like how to set and get user in session 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
	console.log(req.session);
	// basically store session data, app.use() runs on every request
	res.locals.success = req.flash('success');
	res.locals.warn = req.flash('warn');
	res.locals.error = req.flash('error');
	res.locals.user = req.user;
	next();
})

// app.use('/fakeUser', async (req, res) => {
// 	const user = new User({ email: 'dust@dust.com', username: 'Dust'});
// 	const newUser = await User.register(user, 'pika');
// 	res.send(newUser);
// })

app.use('/hometowns', hometownRoutes);
app.use('/hometowns/:id/reviews', reviewRoutes);

app.use('/', userRoutes);



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