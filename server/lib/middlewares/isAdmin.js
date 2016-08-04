module.exports = function isAdmin (req, res, next) {
  req.auth0.users.get({id: req.user.sub}).then(user => {
    if (user.app_metadata && user.app_metadata.isAdmin) {
      next();
    }
    else {
      res.status(403).json({message: 'Forbidden. Only admins can use this stuff'});
    }
  });
};
