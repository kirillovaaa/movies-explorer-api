require('dotenv').config();

const { NODE_ENV, DATABASE_URL } = process.env;

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const { errors } = require('celebrate');
const rateLimiter = require('./middlewares/rateLimiter');

const { errorMiddleware } = require('./middlewares/error');
const { authMiddleware } = require('./middlewares/auth');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const authRoutes = require('./routes/auth');
const routes = require('./routes');

const app = express();
const port = 3000;

// подключаемся к БД
mongoose.connect(
  NODE_ENV === 'production'
    ? DATABASE_URL
    : 'mongodb://127.0.0.1:27017/bitfilmsdb',
);

// подключаем ограничитель трафика
app.use(rateLimiter);

// подключаем helmet
app.use(helmet());

// подключаем cors middleware
if (NODE_ENV === 'production') {
  app.use(
    cors({
      origin: [
        'http://movies-diploma.nomoredomains.xyz',
        'https://movies-diploma.nomoredomains.xyz',
      ],
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    }),
  );
} else {
  app.use(cors());
}

// подключаем json парсер
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// логгер запросов
app.use(requestLogger);

// незащищенные роуты
app.use(authRoutes);

// защита авторизацией
app.use(authMiddleware);

// защищенные роуты
app.use(routes);

// логгер ошибок
app.use(errorLogger);

// отлов ошибки
app.use(errors({ statusCode: 400 }));
app.use(errorMiddleware);

app.listen(port, () => {
  /* eslint no-console: "off" */
  console.log(`App listening on port ${port}`);
});
