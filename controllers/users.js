const mongoose = require('mongoose');

const User = require('../models/user');

const { InvalidRequestError } = require('../errors/InvalidRequestError');
const { ServerError } = require('../errors/ServerError');

// роут для получения информации о пользователе
module.exports.getMe = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => res.send(user))
    .catch((err) => next(new ServerError(err)));
};
// обновляем информацию о пользователе
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new InvalidRequestError());
      } else {
        next(new ServerError());
      }
    });
};
