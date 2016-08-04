import jwt from 'jsonwebtoken';

module.exports = function parseUser (req, res, next) {
  const token = req.headers.authorization.replace('Bearer ', '');
  const userdata = jwt.decode(token);

  req.user = { id: userdata.sub };

  next();
};
