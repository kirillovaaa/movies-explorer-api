class ServerError extends Error {
  constructor(message = 'Ошибка сервера') {
    super(message);
    this.name = 'ServerError';
    this.statusCode = 500;
  }
}

module.exports.ServerError = ServerError;
