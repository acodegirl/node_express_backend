require('express-async-errors');
const error = require('./middleware/error');
const config = require('config');
const express = require('express');
const app = express();
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const home = require('./routes/home');
const users = require('./routes/user');
const auth = require('./routes/auth');

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose
  .connect('mongodb://localhost/node-course-exercises')
  .then(() => console.log('Connected to MongoDB....'))
  .catch(() => console.log('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/', home);

app.use(error);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Web server is listening on port ${port}`);
});
