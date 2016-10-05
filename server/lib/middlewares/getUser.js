import _ from 'lodash';

import * as constants from '../../constants';


const getUserRoles = (user) => {
  const roles = [
    user.roles,
    user.app_metadata && user.app_metadata.roles,
    user.authorization && user.authorization.roles,
    user.app_metadata && user.app_metadata.authorization && user.app_metadata.authorization.roles
  ];
  return _(roles)
    .flatten()
    .filter(role => role)
    .uniq()
    .value();
};

const checkRole = (data) => {
  let accessLevel = 0;
  if (!data) return accessLevel;

  const parsedData = (Array.isArray(data)) ? data : data.replace(', ', ',', 'g').split(',');

  if (parsedData.indexOf(constants.ADMIN_ROLE_NAME) >= 0) accessLevel = constants.ADMIN_ACCESS_LEVEL;

  return accessLevel;
};

module.exports = function getUserAccessLevel(req, res, next) {
  const roles = getUserRoles(req.user);
  req.user.role = checkRole(roles); // eslint-disable-line no-param-reassign
  next();
};
