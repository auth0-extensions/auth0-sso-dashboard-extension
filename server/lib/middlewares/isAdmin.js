import { ForbiddenError } from '../errors';

module.exports = function isAdmin (req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  }
  else {
    next(new ForbiddenError('Only admins can use this stuff'));
  }
};
