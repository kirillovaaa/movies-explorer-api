class InvalidRequestError extends Error {
  constructor(message = 'Переданы некорректные данные') {
    super(message);
    this.name = 'InvalidRequestError';
    this.statusCode = 400;
  }
}

module.exports.InvalidRequestError = InvalidRequestError;
