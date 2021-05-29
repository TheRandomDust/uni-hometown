const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isAuthor, validateHometown } = require('../middleware');
const hometownsCtrl = require('../controllers/hometowns');
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
	.get( wrapAsync(hometownsCtrl.index))
	.post(
		isLoggedIn, 
		upload.array('images[town]', 5), 
		validateHometown,  // TODO need to fix Joi validations to run before uploads, kinda janky
		wrapAsync(hometownsCtrl.createHometown));

router.get('/new', isLoggedIn, hometownsCtrl.renderNewForm);

router.route('/:id')
	.get(isLoggedIn, wrapAsync(hometownsCtrl.showHometown))
	.put(isLoggedIn, isAuthor, upload.array('images[town]', 5), validateHometown, wrapAsync(hometownsCtrl.updateHometown))
	.delete(isAuthor, wrapAsync(hometownsCtrl.deleteHometown));

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(hometownsCtrl.renderEditForm));

module.exports = router;