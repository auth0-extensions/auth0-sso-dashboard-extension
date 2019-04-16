const tools = require('auth0-extension-express-tools');

const expressApp = require('./server').default;
const config = require('./server/lib/config');
const logger = require('./server/lib/logger');

const createServer = tools.createServer((cfg, storage) => {
  logger.info('Starting SSO Dashboard Extension - Version:', process.env.CLIENT_VERSION);
  return expressApp(cfg, storage);
});

module.exports = (context, req, res) => {
  const publicUrl = (req.x_wt && req.x_wt.ectx && req.x_wt.ectx.PUBLIC_WT_URL) || false;
  if (!publicUrl) {
    config.setValue('PUBLIC_WT_URL', tools.urlHelpers.getWebtaskUrl(req));
  }

  createServer(context, req, res);
};
