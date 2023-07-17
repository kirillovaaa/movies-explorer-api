class ConflictError extends Error {
  constructor(message = 'Конфликтующий запрос') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

module.exports.ConflictError = ConflictError;
