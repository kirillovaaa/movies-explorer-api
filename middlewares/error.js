module.exports.errorMiddleware = (err, req, res, next) => {
  res.status(err.statusCode).json({ message: err.message });
  next(err);
};
