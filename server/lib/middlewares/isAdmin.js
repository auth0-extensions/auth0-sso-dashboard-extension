import { ForbiddenError } from 'auth0-extension-tools';
import * as constants from '../../constants';

module.exports = function isAdmin(req, res, next) {
  if (req.user && req.user.role === constants.ADMIN_ACCESS_LEVEL) {
    next();
  } else {
    next(new ForbiddenError('Only admins can use this endpoint.'));
  }
};
