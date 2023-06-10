const router = require('express').Router();

const {
  userSigninValidator,
  userSignupValidator,
} = require('../middlewares/routes-validation');
const {
  login,
  createUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const { NotFoundError } = require('../utils/errors/constructors/not-found');
const { errorMessage } = require('../utils/errors/messages');

// Sign-in:
router.post('/signin', userSigninValidator, login);

// Create user:
router.post('/signup', userSignupValidator, createUser);

// Authorization middleware:
router.use(auth);

// Routes below are available only after authorization (!)

// Users:
router.use('/users', require('./users'));

// Movies
router.use('/movies', require('./movies'));

// Other routes:
router.all('*', (req, res, next) => next(new NotFoundError(errorMessage.page.notFound)));

module.exports = router;
