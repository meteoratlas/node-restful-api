const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  patchTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
  aliasTopTours,
} = require('../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/tour-stats').get(getTourStats);

// middleware cam optionally be first value of route function
router.route('/').get(/*authController.protect,*/ getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(patchTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

module.exports = router;
