const router = require("express").Router();
const mongoose = require("mongoose");
const { Joi, celebrate } = require("celebrate");

const JoiObjectId = Joi.string()
  .custom((value, helpers) => {
    const filtered = mongoose.Types.ObjectId.isValid(value);
    return !filtered ? helpers.error("any.invalid") : value;
  }, "invalid objectId")
  .required();

const {
  getMovies,
  createMovies,
  deleteMoviesById,
} = require("../controllers/movies");

router.get("/movies", getMovies);
router.post(
  "/movies",
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.number().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .regex(
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
        ),
      trailerLink: Joi.string()
        .required()
        .regex(
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
        ),
      thumbnail: Joi.string()
        .required()
        .regex(
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
        ),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovies,
);
router.delete(
  "/movies/:moviesId",
  celebrate({
    params: Joi.object().keys({
      movieId: JoiObjectId,
    }),
  }),
  deleteMoviesById,
);
