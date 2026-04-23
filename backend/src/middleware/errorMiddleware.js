module.exports = function errorMiddleware(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message || 'Server error' });
};
