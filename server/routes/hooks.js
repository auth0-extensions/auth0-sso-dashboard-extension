import _ from 'lodash';
import Promise from 'bluebird';
import { Router as router } from 'express';
import config from '../lib/config';
import logger from '../lib/logger';
import { managementClient, validateHookToken } from '../lib/middlewares';

export default () => {
  const hooks = router();
  hooks.use('/on-install', validateHookToken('/.extensions/on-install'));
  hooks.use('/on-uninstall', validateHookToken('/.extensions/on-uninstall'));
  hooks.delete('/on-uninstall', managementClient, (req, res) => {
    const clientId = config('AUTH0_CLIENT_ID');
    console.log('Starting on-uninstall v 1:');
    console.log('Removing client ' + clientId);
    console.log(req.auth0);
    req.auth0.clients.delete({ client_id: clientId })
      .then(() => {
        logger.debug(`Deleted client ${clientId}`);
        res.sendStatus(204);
      })
      .catch((err) => {
        console.log(err);
        logger.debug(`Error deleting client ${clientId}`);
        logger.error(err);
        res.sendStatus(500);
      });
    res.sendStatus(204);
  });
  return hooks;
};
