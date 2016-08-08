module.exports = function getUser (req, res, next) {
  req.auth0.users.get({id: req.user.sub}).then(user => {
    req.user.isAdmin = (user.app_metadata && user.app_metadata.isAdmin);

    next();
  });
};
