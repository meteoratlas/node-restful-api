const _ = require('lodash');
const Tour = require('./../models/tourModel');

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'failure',
      message: 'The supplied body must have a name and price defined.',
    });
  }
  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

const getTour = (req, res) => {
  const id = parseInt(req.params.id);
  //const tour = tours.find((el) => el.id === id);

  // if (!tour || _.isEmpty(tour)) {
  //   return res.status(404).json({
  //     status: 'failure',
  //     message: 'The supplied id is not valid.',
  //   });
  // }

  res.status(200).json({
    status: 'success',
    // data: {
    //   tour,
    // },
  });
};

const createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    // data: {
    //   tour: newTour,
    // },
  });
};
const patchTour = (req, res) => {
  const id = parseInt(req.params.id);

  res.status(201).json({
    status: 'success',
    data: {
      tour: 'Updated tour',
    },
  });
};
const deleteTour = (req, res) => {
  const id = parseInt(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports = {
  checkBody,
  getAllTours,
  createTour,
  getTour,
  patchTour,
  deleteTour,
};
