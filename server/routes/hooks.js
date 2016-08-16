import _ from 'lodash';
import Promise from 'bluebird';
import { Router as router } from 'express';
import config from '../config';
import logger from '../lib/logger';
import { managementClient, validateHookToken } from '../lib/middlewares';

export default () => {
  const hooks = router();
  hooks.use('/on-install', validateHookToken('/.extensions/on-install'));
  hooks.use('/on-uninstall', validateHookToken('/.extensions/on-uninstall'));
  hooks.delete('/on-uninstall', managementClient, (req, res) => {
    req.auth0.clients.delete({ client_id: config('AUTH0_CLIENT_ID') })
      .then(() => {
        logger.debug(`Deleted client ${config('AUTH0_CLIENT_ID')}`);
        res.sendStatus(204);
      })
      .catch((err) => {
        logger.debug(`Error deleting client ${config('AUTH0_CLIENT_ID')}`);
        logger.error(err);
        res.sendStatus(500);
      });
    res.sendStatus(204);
  });
  return hooks;
};
