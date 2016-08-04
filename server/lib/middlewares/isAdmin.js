import { ForbiddenError } from '../errors';

module.exports = function isAdmin (req, res, next) {
  req.auth0.users.get({id: req.user.sub}).then(user => {
    if (user.app_metadata && user.app_metadata.isAdmin) {
      next();
    }
    else {
      next(new ForbiddenError('Only admins can use this stuff'));
    }
  });
};
