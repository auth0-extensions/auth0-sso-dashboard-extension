const tools = require('auth0-extension-express-tools');

const app = require('./server');
const logger = require('./server/lib/logger');

module.exports = tools.createExpressServer((config, storage) => {
  logger.info('Starting SSO Dashboard Extension - Version:', process.env.CLIENT_VERSION);
  return app(config, storage);
});
