class ForbiddenError extends Error {
  constructor(message = 'Доступ к запрошенному ресурсу запрещен') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

module.exports.ForbiddenError = ForbiddenError;
