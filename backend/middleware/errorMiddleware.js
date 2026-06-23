export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for debugging
  console.error('Error Handler Triggered:', err);

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with ID of ${err.value}`;
    error = new Error(message);
    res.statusCode = 404;
  }

  // Mongoose duplicate key (11000)
  if (err.code === 11000) {
    const message = 'Duplicate field value entered or unique constraint violated';
    error = new Error(message);
    res.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = new Error(message);
    res.statusCode = 400;
  }

  const statusCode = res.statusCode === 200 ? 500 : (res.statusCode || 500);

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
