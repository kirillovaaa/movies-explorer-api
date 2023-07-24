const mongoose = require("mongoose");

const User = require("../bitfilmsdb/users");

const { InvalidRequestError } = require("../errors/InvalidRequestError");
const { ServerError } = require("../errors/ServerError");
const { NotFoundError } = require("../errors/NotFoundError");

module.exports.getAllUsers = (res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      next(new ServerError());
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError("Пользователь с указанным _id не найден");
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        next(err);
      } else {
        next(new ServerError());
      }
    });
};

// роут для получения информации о пользователе
module.exports.getMe = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => res.send({ data: user }))
    .catch((err) => next(new ServerError(err)));
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new InvalidRequestError());
      } else {
        next(new ServerError());
      }
    });
};
