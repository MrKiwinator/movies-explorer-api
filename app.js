const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errors-handler');
const { limiter } = require('./middlewares/rate-limiter');
const { PORT, DB_ADDRESS } = require('./config');

// creating app
const app = express();

app.use(helmet());

app.use(cors({
  origin: [
    'http://localhost:3001',
    'http://movies-explorer.nomoredomains.monster',
    'https://movies-explorer.nomoredomains.monster',
  ],
  // credentials: true,
  maxAge: 60,
}));

// connecting to the Mongo db
mongoose.connect(DB_ADDRESS, {
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

// Listening port 3000:
app.listen(PORT, () => {
  // If everything is ok, console will return the listening app port:
  console.log(`App listening on port ${PORT}`);
});
