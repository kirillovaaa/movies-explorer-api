const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Формат почты неверный',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
