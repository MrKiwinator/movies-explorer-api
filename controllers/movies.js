const Movie = require('../models/movie');
const { BadRequestError } = require('../utils/errors/constructors/bad-request');
const { NotFoundError } = require('../utils/errors/constructors/not-found');
const { ForbiddenError } = require('../utils/errors/constructors/forbidden');
const { InternalError } = require('../utils/errors/constructors/internal');
const { errorMessage } = require('../utils/errors/messages');

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.status(201).send({ movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessage.movie.badRequest.create));
        return;
      }
      next(new InternalError(errorMessage.server.internal));
    });
};

const getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(() => next(new InternalError(errorMessage.server.internal)));
};

const deleteMovie = (req, res, next) => {
  const userId = req.user._id;

  Movie.findById(req.params.id)
    .then((movie) => {
      // Check if movie exist:
      if (!movie) {
        next(new NotFoundError(errorMessage.movie.notFound));
        return;
      }
      // Check if user is owner of movie:
      if (userId !== movie.owner.toString()) {
        next(new ForbiddenError(errorMessage.movie.forbidden));
        return;
      }
      // If movie exist and user it's owner - delete movie:
      movie.deleteOne()
        .then(() => {
          res.status(200).send(movie);
        })
        .catch(() => new InternalError(errorMessage.server.internal));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessage.movie.badRequest.delete));
        return;
      }
      next(new InternalError(errorMessage.server.internal));
    });
};

module.exports = {
  createMovie,
  getUserMovies,
  deleteMovie,
};
