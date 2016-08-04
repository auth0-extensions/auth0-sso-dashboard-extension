import config from '../config';
import managementApiClient from '../managementApiClient';

module.exports = function managementClientMiddleware(req, res, next) {
  managementApiClient.getForClient(config('AUTH0_DOMAIN'), config('AUTH0_CLIENT_ID'), config('AUTH0_CLIENT_SECRET'))
    .then(auth0 => {
      req.auth0 = auth0;
      next();
    })
    .catch((err) => {
      next(err);
    });
};
