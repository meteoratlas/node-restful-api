const express = require('express');
const viewController = require('../controllers/viewsController');

const router = express.Router();
const authController = require('../controllers/authController');

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);

router.get('/login', viewController.loginForm);

router.get('/tour/:slug', viewController.getTour);

module.exports = router;
