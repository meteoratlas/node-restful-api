const _ = require('lodash');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  // 100 reqs per hour
  message: 'Too many requests from this IP; please try again later.',
});
app.use('/api', limiter);

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // passing an argument to next() always tells express there was an error
  next(
    new AppError(
      `The url ${req.originalUrl} was not found on this server.`,
      404
    )
  );
});

// error handling middleware
app.use(errorHandler);

module.exports = app;
