const notFound = (req, res, next) => {
  const error = new Error(`Not found ${req.originalUrl}`, 404);
  next(error);
};

export default notFound;
