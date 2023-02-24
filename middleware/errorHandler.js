const errorHandler = (err, req, res, next) => {
  const status = res.statusCode || 500;
  res.status(status);
  res.json({ message: err.message, isError: true });
};

export default errorHandler;
