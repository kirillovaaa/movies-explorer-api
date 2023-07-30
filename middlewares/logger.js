const { transports, format } = require('winston');
const expressWinston = require('express-winston');

const { prettyPrint, combine } = format;

const requestLogger = expressWinston.logger({
  transports: [new transports.File({ filename: 'request.log' })],
  format: combine(
    format.json(),
    prettyPrint(),
  ),
});

const errorLogger = expressWinston.errorLogger({
  transports: [new transports.File({ filename: 'error.log' })],
  format: combine(
    format.json(),
    prettyPrint(),
  ),
});

module.exports = {
  requestLogger,
  errorLogger,
};
