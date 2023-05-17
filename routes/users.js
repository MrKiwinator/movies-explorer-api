const router = require('express').Router();
const { updateUserInfoValidator } = require('../middlewares/routes-validation');
const {
  getCurrentUser, updateUserInfo,
} = require('../controllers/users');

// route /users/me

router.get('/me', getCurrentUser);

router.patch('/me', updateUserInfoValidator, updateUserInfo);

module.exports = router;
