module.exports = function authMiddleware(req, _res, next) {
  req.user = null;
  next();
};
