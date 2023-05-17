const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NODE_ENV, JWT_SECRET } = require('../config');
const { BadRequestError } = require('../utils/errors/constructors/bad-request');
const { InternalError } = require('../utils/errors/constructors/internal');
const { NotFoundError } = require('../utils/errors/constructors/not-found');
const { ConflictError } = require('../utils/errors/constructors/conflict');
const { UnauthorizedError } = require('../utils/errors/constructors/unauthorized');
const { errorMessage } = require('../utils/errors/messages');

// Create user:
const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => {
      res.status(200).send({
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessage.user.badRequest.create));
        return;
      }

      if (err.code === 11000) {
        next(new ConflictError(errorMessage.user.conflict));
        return;
      }

      next(new InternalError(errorMessage.server.internal));
    });
};

// Login:
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // Generate token:
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          httpOnly: true,
          maxAge: 3600000,
          sameSite: true,
        })
        .send({
          _id: user._id,
          email: user.email,
          name: user.name,
        })
        .end();
    })
    .catch((err) => {
      if (err.name === 'UnauthorizedError') {
        next(new UnauthorizedError(errorMessage.user.unauthorized));
        return;
      }
      next(new InternalError(errorMessage.server.internal));
    });
};

// signout
const signout = (req, res) => {
  res.clearCookie('jwt').end();
};

// Get current user:
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      // Check if user exist:
      if (!user) {
        next(new NotFoundError(errorMessage.user.notFound));
        return;
      }
      res.status(200).send(user);
    })
    .catch(() => {
      next(new InternalError(errorMessage.server.internal));
    });
};

// Update user info:
const updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { runValidators: true, new: true },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessage.user.badRequest.updateInfo));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError(errorMessage.user.conflict));
        return;
      }
      next(new InternalError(errorMessage.server.internal));
    });
};

module.exports = {
  createUser,
  login,
  signout,
  getCurrentUser,
  updateUserInfo,
};
