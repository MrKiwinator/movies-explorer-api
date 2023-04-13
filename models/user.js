const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { UnauthorizedError } = require('../utils/errors/constructors/unauthorized');
const { errorMessage } = require('../utils/errors/messages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: errorMessage.validator.email,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function _findByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(errorMessage.user.unauthorized));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(errorMessage.user.unauthorized));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
