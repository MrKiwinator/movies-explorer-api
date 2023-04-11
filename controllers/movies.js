const Movie = require('../models/movie');
const { BadRequestError } = require('../utils/errors/bad-request');
const { NotFoundError } = require('../utils/errors/not-found');
const { ForbiddenError } = require('../utils/errors/forbidden');
const { InternalError } = require('../utils/errors/internal');

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
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(new InternalError('Произошла ошибка cервера'));
    });
};

const getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(200).send({ movies });
    })
    .catch(() => next(new InternalError('Произошла ошибка cервера')));
};

const deleteMovie = (req, res, next) => {
  const userId = req.user._id;

  Movie.findById(req.params.id)
    .then((movie) => {
      // Check if movie exist:
      if (!movie) {
        next(new NotFoundError('Передан несуществующий _id карточки'));
        return;
      }
      // Check if user is owner of movie:
      if (userId !== movie.owner.toString()) {
        next(new ForbiddenError('Нет доступа к запрашиваемой карточке'));
        return;
      }
      // If movie exist and user it's owner - delete movie:
      movie.deleteOne()
        .then(() => {
          res.status(200).send(movie);
        })
        .catch(() => new InternalError('Произошла ошибка cервера'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id карточки'));
        return;
      }
      next(new InternalError('Произошла ошибка cервера'));
    });
};

module.exports = {
  createMovie,
  getUserMovies,
  deleteMovie,
};
