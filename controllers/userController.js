const User = require('./../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users,
    },
  });
});

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is currently unavailable.',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is currently unavailable.',
  });
};

const patchUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is currently unavailable.',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is currently unavailable.',
  });
};

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  patchUser,
  deleteUser,
};
