const Promise = require('bluebird');
const { ValidationError } = require('auth0-extension-tools');

const { addGrant, removeGrant, getResourceServer } = require('./queries');

const getStatus = (req, storage) =>
  storage.read()
    .then((data) => {
      const result = { authorizationEnabled: data.authorizationEnabled };

      return getResourceServer(req, 'urn:auth0-authz-api')
        .then((resourceServer) => {
          result.authorizationApiAvailable = !!resourceServer;

          return result;
        });
    });

const enable = (req, storage) =>
  storage.read()
    .then((data) => {
      if (data.authorizationEnabled) {
        return Promise.resolve();
      }

      return getResourceServer(req, 'urn:auth0-authz-api')
        .then((resourceServer) => {
          if (!resourceServer) {
            const error = new ValidationError('Authorization API not found.');
            error.status = 400;
            return Promise.reject(error);
          }

          return addGrant(req)
            .then(() => {
              data.authorizationEnabled = true;
              return storage.write(data);
            });
        });
    });

const disable = (req, storage) =>
  storage.read()
    .then((data) => {
      if (!data.authorizationEnabled) {
        return Promise.resolve();
      }

      return removeGrant(req)
        .then(() => {
          data.authorizationEnabled = false;
          return storage.write(data);
        });
    });

module.exports = {
  getStatus,
  enable,
  disable
};
