import _ from 'lodash';

/*
 * Determine if user has permission to access.
 */
export const hasPermissions = (metadata, permissionString) => {
  const permissions = permissionString.replace(new RegExp(' ', 'g'), '').split(',');
  const userPermissions = metadata && metadata.authorization && metadata.authorization.permissions;

  if (!permissionString && !permissions.length) {
    return true;
  }

  if (!userPermissions) {
    return false;
  }

  const intersection = _.intersection(permissions, userPermissions);
  return intersection && intersection.length >= 1;
};
