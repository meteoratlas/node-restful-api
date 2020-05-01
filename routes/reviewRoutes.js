const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({
  mergeParams: true, // allows getting params from other routers (tour, in this case)
});

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id', reviewController.deleteReview)
  .get(reviewController.getReview)
  .patch(reviewController.updateReview);

module.exports = router;
