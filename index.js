const path = require('path');
const nconf = require('nconf');
const logger = require('./server/lib/logger');

// Handle uncaught.
process.on('uncaughtException', (err) => {
  logger.error(err);
});

// Initialize configuration.
nconf
  .argv()
  .env()
  .file(path.join(__dirname, './server/config.json'))
  .defaults({
    DATA_CACHE_MAX_AGE: 1000 * 10,
    NODE_ENV: 'development',
    HOSTING_ENV: 'default',
    PORT: 3001,
    TITLE: 'SSO Dashboard'
  });

// Start the server.
const app = require('./server')(key => nconf.get(key), null);

app.listen(nconf.get('PORT'), (error) => {
  if (error) {
    logger.error(error);
  } else {
    logger.info(`Express listening on http://localhost:${nconf.get('PORT')}`);
  }
});
