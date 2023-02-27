const errorHandler = (err, req, res, next) => {
  const status = err.statusCode === 200 ? 500 : err.statusCode;
  res.status(status);
  res.json({ message: err.message, isError: true });
};

export default errorHandler;
