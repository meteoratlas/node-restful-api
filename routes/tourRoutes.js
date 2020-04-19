const express = require('express');
const {
  checkBody,
  getAllTours,
  createTour,
  getTour,
  patchTour,
  deleteTour,
} = require('../controllers/tourController');

const router = express.Router();

//router.param('id', checkID);

// middleware cam optionally be first value of route function
router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(patchTour).delete(deleteTour);

module.exports = router;
