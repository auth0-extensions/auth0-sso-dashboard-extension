import _ from 'lodash';
import Promise from 'bluebird';
import { Router as router } from 'express';

import logger from '../lib/logger';
import { managementClient, validateHookToken } from '../lib/middlewares';

export default () => {
  const hooks = router();
  hooks.use('/on-install', validateHookToken('/.extensions/on-install'));
  hooks.use('/on-uninstall', validateHookToken('/.extensions/on-uninstall'));
  hooks.delete('/on-uninstall', managementClient, (req, res) => {
    res.sendStatus(204);
  });
  return hooks;
};
