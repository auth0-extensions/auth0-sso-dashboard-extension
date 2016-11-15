module.exports = function (expectedScope) {
  return function (req, res, next) {
    console.log(req.user);
    if (!req.user || !req.user.scope || req.user.scope.indexOf(expectedScope) < 0) {
      return next(new Error(`Cannot perform action. Missing scope ${expectedScope}`));
    }
    next();
  };
};
