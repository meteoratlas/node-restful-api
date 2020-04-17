const dotenv = require('dotenv').config();
const app = require('./app');

const port = 3000;
app.listen(process.env.PORT, () => {
  console.log('App running on port', process.env.PORT);
});
