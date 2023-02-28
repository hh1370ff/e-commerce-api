const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  err.statusCode;
  const error = {
    message: err.message,
    status: statusCode,
    stack: err.stack,
  };
  res.status(statusCode).json({ error });
};

export default errorHandler;
