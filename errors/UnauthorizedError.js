class UnauthorizedError extends Error {
  constructor(message = 'Необходима авторизация') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

module.exports.UnauthorizedError = UnauthorizedError;
