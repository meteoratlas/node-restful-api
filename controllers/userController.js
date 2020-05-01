const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// not necessary, use the sign up route instead
//const createUser = factory.createOne(User);

const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);

// do not update passwords with this patch route!
const patchUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

const updateCurrentUser = catchAsync(async (req, res, next) => {
  // if user posts password, raise error
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('Please change your password in the provided route.', 400)
    );
  }
  // filter out attributes we don't want updated
  // ie, only allow name and email for now
  const filteredBody = filterObj(req.body, 'name', 'email');

  // update user document
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const deleteCurrentUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getAllUsers,
  getUser,
  patchUser,
  deleteUser,
  updateCurrentUser,
  deleteCurrentUser,
};
