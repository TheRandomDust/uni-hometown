const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isAuthor, validateHometown } = require('../middleware');
const hometownsCtrl = require('../controllers/hometowns');

router.route('/')
	.get( wrapAsync(hometownsCtrl.index))
	.post(isLoggedIn, validateHometown, wrapAsync(hometownsCtrl.createHometown));

router.get('/new', isLoggedIn, hometownsCtrl.renderNewForm);

router.route('/:id')
	.get(isLoggedIn, wrapAsync(hometownsCtrl.showHometown))
	.put(isLoggedIn, isAuthor, validateHometown, wrapAsync(hometownsCtrl.updateHometown))
	.delete(isAuthor, wrapAsync(hometownsCtrl.deleteHometown));

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(hometownsCtrl.renderEditForm));

module.exports = router;