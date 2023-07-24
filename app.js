require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");

const { errorMiddleware } = require("./middlewares/error");
const { authMiddleware } = require("./middlewares/auth");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const moviesRouter = require("./routes/movies");

const { NotFoundError } = require("./errors/NotFoundError");

const app = express();
const port = 3000;

// подключаемся к БД
mongoose.connect("mongodb://127.0.0.1:27017/bitfilmsdb");

// подключаем cors middleware
app.use(
  cors({
    origin: [
      "movies-diploma.nomoredomains.xyz",
      "api.movies-diploma.nomoredomains.xyz",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// подключаем json парсер
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// обработчик логгера
app.use(requestLogger);

// FIXME: удалить после ревью
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

// незащищенные роуты
app.use(authRouter);

// защита авторизацией
app.use(authMiddleware);

// защищенные роуты
app.use(usersRouter);
app.use(moviesRouter);

// обработка роута "*" - ошибка 404
app.use((req, res, next) => {
  next(new NotFoundError());
});

// обработчик логгера - ошибки
app.use(errorLogger);

// отлов ошибки
app.use(errors({ statusCode: 400 }));
app.use(errorMiddleware);

app.listen(port, () => {
  /* eslint no-console: "off" */
  console.log(`Example app listening on port ${port}`);
});
