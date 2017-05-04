import _ from 'lodash';

/*
 * Determine if user has required group to access to application.
 */
export const hasGroup = (userGroups, appGroups) => {
  if (!appGroups || !appGroups.length) {
    return true;
  }

  if (!userGroups) {
    return false;
  }

  const intersection = _.intersection(userGroups, appGroups);
  return intersection && intersection.length >= 1;
};
