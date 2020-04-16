const fs = require('fs');
const _ = require('lodash');
const express = require('express');

const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour || _.isEmpty(tour)) {
    return res.status(404).json({
      status: 'failure',
      message: 'The supplied id is not valid.',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
const patchTour = (req, res) => {
  const id = parseInt(req.params.id);
  if (id < 0 || id > tours.length) {
    return res.status(404).json({
      status: 'failure',
      message: 'The supplied id is not valid.',
    });
  }
  res.status(201).json({
    status: 'success',
    data: {
      tour: 'Updated tour',
    },
  });
};
const deleteTour = (req, res) => {
  const id = parseInt(req.params.id);
  if (id < 0 || id > tours.length) {
    return res.status(404).json({
      status: 'failure',
      message: 'The supplied id is not valid.',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(patchTour).delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log('App running on port', port);
});
