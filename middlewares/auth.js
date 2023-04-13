const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors/constructors/unauthorized');
const { errorMessage } = require('../utils/errors/messages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // getting jwt from cookies:
  const token = req.cookies.jwt;

  if (!token) {
    next(new UnauthorizedError(errorMessage.auth.unauthorized));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    next(new UnauthorizedError(errorMessage.auth.unauthorized));
    return;
  }

  req.user = payload;

  next();
};
