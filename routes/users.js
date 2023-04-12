const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCurrentUser, updateUserInfo,
} = require('../controllers/users');

// route /users/me

router.get('/me', getCurrentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
}), updateUserInfo);

module.exports = router;
