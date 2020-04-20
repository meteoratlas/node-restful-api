const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  patchTour,
  deleteTour,
} = require('../controllers/tourController');

const router = express.Router();

//router.param('id', checkID);

// middleware cam optionally be first value of route function
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(patchTour).delete(deleteTour);

module.exports = router;
