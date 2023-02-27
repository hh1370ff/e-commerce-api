import HttpError from "../utils/extendedError.js";

const notFound = (req, res, next) => {
  const error = new HttpError(`Not found ${req.originalUrl}`, 404);
  next(error);
};

export default notFound;
