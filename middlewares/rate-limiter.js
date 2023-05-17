const rateLimit = require('express-rate-limit');
const { errorMessage } = require('../utils/errors/messages');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: errorMessage.limiter.request,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  limiter,
};
