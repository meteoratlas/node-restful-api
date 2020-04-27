const _ = require('lodash');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// set secure HTTP headers
app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  // 100 reqs per hour
  message: 'Too many requests from this IP; please try again later.',
});
app.use('/api', limiter);

// body parser
app.use(
  express.json({
    limit: '10kb', // req bodies larger than 10kb not accepted
  })
);

// data sanitization (NoSQL query injection)
app.use(mongoSanitize());
// data sanitization (XSS)
app.use(xss());

// prevent paramenter pollution
app.use(
  hpp({
    // okay to have multiple params with these values
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

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
