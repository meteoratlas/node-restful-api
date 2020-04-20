const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  patchTour,
  deleteTour,
  aliasTopTours,
} = require('../controllers/tourController');

const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

// middleware cam optionally be first value of route function
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(patchTour).delete(deleteTour);

module.exports = router;
