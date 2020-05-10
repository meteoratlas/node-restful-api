const express = require('express');
const viewController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', viewController.getOverview);

router.get('/login', viewController.loginForm);

router.get('/tour/:slug', viewController.getTour);

module.exports = router;
