import _ from 'lodash';

/*
 * Determine if user has required role to access to application.
 */
export const hasRole = (userRoles, appRoles) => {
  if (!appRoles || !appRoles.length) {
    return true;
  }

  if (!userRoles) {
    return false;
  }

  const intersection = _.intersection(userRoles, appRoles);
  return intersection && intersection.length >= 1;
};
