const errorMiddleware = (err, req, res, next) => {
  console.error(err); // Log the error for debugging

  if (res.headersSent) {
    return next(err); // If response is already sent, don't send another one
  }

  const defaultError = {
    statusCode: 500,
    message: err,
  };

  // Handle missing field validation errors (Mongoose ValidationError)
  if (err.name === "ValidationError") {
    defaultError.statusCode = 400;
    defaultError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  res.status(defaultError.statusCode).json({ message: defaultError.message });
};

module.exports = errorMiddleware;
