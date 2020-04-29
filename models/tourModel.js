const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less than 40 characters.'],
      minlength: [5, 'A tour name must have more than 5 characters.'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration.'],
      min: [1, 'Duration must be 1 or above.'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size.'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty.'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be easy, medium, or difficult.',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be 1 or above.'],
      max: [5, 'Rating must be 5 or below.'],
    },
    ratingQuantity: { type: Number, default: 0 },
    price: {
      type: Number,
      required: [true, 'A tour must have a price.'],
      min: [1, 'Price must be 1 or above.'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // "this" is only accessible on document creation - NOT update
          return value < this.price;
        },
        message: 'Discount price ({VALUE}) must be below the price',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description.'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image.'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    // embedded object
    startLocation: {
      // geoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    // schema options
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// *document* middleware: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  // this refers to the current document here
  this.slug = slugify(this.name, { lower: true });
  next();
});

// embedding array of data example
// gets user ids in req.body, and queries the users document to return the user docs associated with that id

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// doc is the previously processed document
tourSchema.post('save', function (doc, next) {
  next();
});

// These involve removing secret tours from query and aggregate results

// *query* middleware
// /^find/ = matches for all strings that begin with "find"
// catches find(), findOne(), findOneAndDelete(), etc.
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// populate to embed guide info during query only
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms.`);

  next();
});

// aggregation middleware

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
