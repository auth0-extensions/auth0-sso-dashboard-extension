const path = require('path');
const morgan = require('morgan');
const Express = require('express');
const bodyParser = require('body-parser');
const tools = require('auth0-extension-tools');
const { middlewares, routes } = require('auth0-extension-express-tools');

const api = require('./routes/api');
const meta = require('./routes/meta');
const hooks = require('./routes/hooks');

const logger = require('./lib/logger');
const config = require('./lib/config');
const htmlRoute = require('./routes/html');

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
    rta: config('AUTH0_RTA').replace('https://', ''),
    domain: config('AUTH0_DOMAIN'),
    baseUrl: config('PUBLIC_WT_URL'),
    clientName: 'SSO Dashboard',
    urlPrefix: '/admins',
    sessionStorageKey: 'sso-dashboard:apiToken',
    scopes: 'read:clients delete:clients read:connections read:resource_servers create:resource_servers read:client_grants create:client_grants delete:client_grants'
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
