const url = require('url');
const tools = require('auth0-extension-express-tools');

const expressApp = require('./server').default;
const config = require('./server/lib/config');
const logger = require('./server/lib/logger');
const webtask = require('./server/lib/webtask');

tools.urlHelpers.getBaseUrl = (req) => {
  const originalUrl = url.parse(req.originalUrl || '').pathname || '';
  return url.format({
    protocol: 'https',
    host: req.headers.host,
    pathname: originalUrl.replace(req.path, '').replace(/\/$/g, '')
  });
};

const createServer = tools.createServer((cfg, storage) => {
  logger.info('Starting SSO Dashboard Extension - Version:', process.env.CLIENT_VERSION);
  return expressApp(cfg, storage);
});


module.exports = (context, req, res) => {
  config.setValue('PUBLIC_WT_URL', webtask.getUrl(req));
  createServer(context, req, res);
};
