const { Router } = require('express');
const { middlewares } = require('auth0-extension-express-tools');

const config = require('../lib/config');
const logger = require('../lib/logger');
const { getResourceServer, createResourceServer, deleteResourceServer } = require('../lib/queries');

module.exports = () => {
  const hooks = Router();
  const hookValidator = middlewares
    .validateHookToken(config('AUTH0_DOMAIN'), config('WT_URL'), config('EXTENSION_SECRET'));

  hooks.use('/on-install', hookValidator('/.extensions/on-install'));
  hooks.use('/on-update', hookValidator('/.extensions/on-update'));
  hooks.use('/on-uninstall', hookValidator('/.extensions/on-uninstall'));

  hooks.use(middlewares.managementApiClient({
    domain: config('AUTH0_DOMAIN'),
    clientId: config('AUTH0_CLIENT_ID'),
    clientSecret: config('AUTH0_CLIENT_SECRET')
  }));

  hooks.post('/on-install', (req, res) => {
    getResourceServer(req, 'urn:auth0-sso-dashboard')
      .then((resourceServer) => {
        if (!resourceServer) {
          return createResourceServer(req);
        }

        return Promise.resolve();
      })
      .then(() => {
        logger.debug('Resource server for the SSO Dashboard extension created.');
      })
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        logger.debug('Error deploying resources for the SSO Dashboard extension.');
        logger.error(err);

        // Even if deleting fails, we need to be able to uninstall the extension.
        res.sendStatus(400);
      });
  });

  hooks.put('/on-update', (req, res) => {
    getResourceServer(req, 'urn:auth0-sso-dashboard')
      .then((resourceServer) => {
        if (!resourceServer) {
          return createResourceServer(req);
        }

        return Promise.resolve();
      })
      .then(() => {
        logger.debug('Resource server for the SSO Dashboard extension created.');
      })
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        logger.debug('Error deploying resources for the SSO Dashboard extension.');
        logger.error(err);

        res.sendStatus(400);
      });
  });

  hooks.delete('/on-uninstall', (req, res) => {
    const clientId = config('AUTH0_CLIENT_ID');
    deleteResourceServer(req)
      .then(() => req.auth0.clients.delete({ client_id: clientId }))
      .then(() => {
        logger.debug(`Deleted client ${clientId}`);
        res.sendStatus(204);
      })
      .catch((err) => {
        logger.debug(`Error deleting client: ${config('AUTH0_CLIENT_ID')}`);
        logger.error(err);

        // Even if deleting fails, we need to be able to uninstall the extension.
        res.sendStatus(204);
      });
  });
  return hooks;
};
