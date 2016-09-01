const roleName = 'SSO Dashboard Administrators';

const checkRole = (data) => {
  let isAdmin = false;
  if (!data) return isAdmin;

  const parsedData = (Array.isArray(data)) ? data : data.replace(', ', ',', 'g').split(',');

  isAdmin = parsedData.indexOf(roleName) >= 0;

  return isAdmin;
};

module.exports = function getUser(req, res, next) {
  const userMeta = req.user.authorization || {};
  const roles = (userMeta.authorization) ? userMeta.authorization.roles || userMeta.roles : userMeta.roles;
  const groups = (userMeta.authorization) ? userMeta.authorization.groups || userMeta.groups : userMeta.groups;

  req.user.isAdmin = checkRole(roles) || checkRole(groups);
  next();
};
