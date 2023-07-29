const mongoose = require('mongoose');

const { ForbiddenError } = require('../errors/ForbiddenError');
const { InvalidRequestError } = require('../errors/InvalidRequestError');
const { ServerError } = require('../errors/ServerError');
const { NotFoundError } = require('../errors/NotFoundError');

const Movie = require('../models/movie');

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (movies.length === 0) {
        next(new NotFoundError('У вас нет сохраненных фильмов'));
      } else {
        res.send(movies);
      }
    })
    .catch(() => {
      next(new ServerError());
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new InvalidRequestError());
      } else {
        next(new ServerError());
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { _id } = req.user;

  if (!mongoose.Types.ObjectId.isValid(req.params.movieId)) {
    next(new InvalidRequestError('Неверный тип _id карточки'));
  } else {
    Movie.findById(req.params.movieId)
      .then((movie) => {
        if (movie === null) {
          return Promise.reject(
            new NotFoundError('Карточка с указанным _id не найдена'),
          );
        }
        if (movie.owner.toString() !== _id) {
          return Promise.reject(new ForbiddenError());
        }
        return Movie.findByIdAndDelete(req.params.movieId);
      })
      .then((movie) => res.send(movie))
      .catch((err) => {
        if (err instanceof NotFoundError || err instanceof ForbiddenError) {
          next(err);
        } else {
          next(new ServerError());
        }
      });
  }
};
