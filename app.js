require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errors-handler');
const { limiter } = require('./middlewares/rate-limiter');

// creating app
const app = express();

// listening port 3000
const { PORT = 3000 } = process.env;

app.use(cors({
  origin: [
    'http://localhost:3001',
    // frontend domain to be inserted here
  ],
  credentials: true,
  maxAge: 60,
}));

// connecting to the Mongo db
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(express.json());

// Request logger (to be inserted b4 all routes):
app.use(requestLogger);

// Requests limiter (100req per 15min):
app.use(limiter);

// Routes of index page:
app.use('/', require('./routes/index'));

// Error logger (to be inserted b4 celebrate errors and app error handler):
app.use(errorLogger);

app.use(errors());

// App errors handler:
app.use(errorHandler);

app.listen(PORT, () => {
  // If everything is ok, console will return the listening app port:
  console.log(`App listening on port ${PORT}`);
});
