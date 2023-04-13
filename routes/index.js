const router = require('express').Router();

const cookieParser = require('cookie-parser');
const {
  userSigninValidator,
  userSignupValidator,
} = require('../middlewares/routes-validation');
const {
  login,
  signout,
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
router.use(cookieParser()); // to get token from cookie
router.use(auth);

// Routes below are available only after authorization (!)

// Users:
router.use('/users', require('./users'));

// Movies
router.use('/movies', require('./movies'));

// Sign-out:
router.post('/signout', signout);

// Other routes:
router.all('*', (req, res, next) => next(new NotFoundError(errorMessage.page.notFound)));

module.exports = router;
