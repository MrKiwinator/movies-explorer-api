const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: 'Слишком много запросов, пожалуйста, повторите позже',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  limiter,
};
