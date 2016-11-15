import path from 'path';
import morgan from 'morgan';
import Express from 'express';
import bodyParser from 'body-parser';
import * as tools from 'auth0-extension-tools';
import { middlewares, routes } from 'auth0-extension-express-tools';

import api from './routes/api';
import meta from './routes/meta';
import hooks from './routes/hooks';

import logger from './lib/logger';
import config from './lib/config';
import htmlRoute from './routes/html';

module.exports = (configProvider, storageProvider) => {
  config.setProvider(configProvider);

  const storage = storageProvider
    ? new tools.WebtaskStorageContext(storageProvider, { force: 1 })
    : new tools.FileStorageContext(path.join(__dirname, './data.json'), { mergeWrites: true });

  const app = new Express();
  app.use(morgan(':method :url :status :response-time ms - :res[content-length]', {
    stream: logger.stream
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // Configure routes.
  app.use(routes.dashboardAdmins({
    secret: config('EXTENSION_SECRET'),
    audience: 'urn:sso-dashboard',
    rta: config('AUTH0_RTA'),
    domain: config('AUTH0_DOMAIN'),
    baseUrl: config('WT_URL'),
    clientName: 'Delegated Administration Extension',
    urlPrefix: '/admins',
    sessionStorageKey: 'sso-dashboard:apiToken',
    scopes: 'read:clients read:connections'
  }));

  // Configure routes.
  app.use('/api', api(storage));
  app.use('/app', Express.static(path.join(__dirname, '../dist')));
  app.use('/meta', meta());
  app.use('/.extensions', hooks());

  // Fallback to rendering HTML.
  app.get('*', htmlRoute());

  // Generic error handler.
  app.use(middlewares.errorHandler(logger.error));
  return app;
};
