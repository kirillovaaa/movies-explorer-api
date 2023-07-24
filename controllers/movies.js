const mongoose = require("mongoose");

const { ForbiddenError } = require("../errors/ForbiddenError");
const { InvalidRequestError } = require("../errors/InvalidRequestError");
const { ServerError } = require("../errors/ServerError");
const { NotFoundError } = require("../errors/NotFoundError");

const Movie = require("../models/movie");

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner })
    .then((movies) => {
      if (movies.length === 0) {
        next(new NotFoundError("У вас нет сохраненных фильмов"));
      } else {
        res.send(movies);
      }
    })
    .catch(next);
};

module.exports.createMovies = (req, res, next) => {
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
  const owner = req.user._id;
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
    owner,
  })
    .then((movies) => res.status(201).send({ movies }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new InvalidRequestError("Переданы некорректные данные"));
      } else {
        next(new ServerError());
      }
    });
};

// module.exports.deleteMoviesById = (req, res, next) => {
//   const { _id } = req.params;
// };

module.exports = {
  getMovies,
  createMovies,
  deleteMoviesById,
};
