const router = require('express').Router();
const {
  createMovieValidator,
  deleteMovieValidator,
} = require('../middlewares/routes-validation');
const {
  createMovie,
  getUserMovies,
  deleteMovie,
} = require('../controllers/movies');

// route /movies

router.get('/', getUserMovies);

router.post('/', createMovieValidator, createMovie);

router.delete('/:id', deleteMovieValidator, deleteMovie);

module.exports = router;
