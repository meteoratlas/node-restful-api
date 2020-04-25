const AppError = require('./../utils/appError');

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFields = (error) => {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field ${value} in unique field.`;
  return new AppError(message, 400);
};

const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid input data, ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token, please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Expired token, please log in again.', 401);

const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error, res) => {
  // operational error, trusted : send message to client
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error('ERROR: ', error);
    // unknown error: do not leak error details to client
    res.status(500).json({
      status: 'error',
      message: 'An error has occured.',
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    let origError = { ...error };
    // console.log(error);
    // console.log(origError);

    if (origError.name === 'CastError') {
      origError = handleCastErrorDB(origError);
    }
    if (origError.code === 11000) {
      console.log('Field issue');

      origError = handleDuplicateFields(origError);
    }
    if (origError.name === 'ValidationError') {
      origError = handleValidationError(origError);
    }
    if (origError.name === 'JsonWebTokenError') {
      origError = handleJWTError();
    }
    if (origError.name === 'TokenExpiredError') {
      origError = handleJWTExpiredError();
    }
    sendErrorProd(origError, res);
  }
};
