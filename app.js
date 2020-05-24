const _ = require('lodash');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingsRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Access-Control-Allow-Origin
app.use(cors());
app.options('*', cors()); // preflight phase

app.use(express.static(path.join(__dirname, 'public')));

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

app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// data sanitization (NoSQL query injection)
app.use(mongoSanitize());
// data sanitization (XSS)
app.use(xss());

app.use(compression());

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

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingsRouter);

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
