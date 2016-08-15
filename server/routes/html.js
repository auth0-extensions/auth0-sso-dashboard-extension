import fs from 'fs';
import url from 'url';
import ejs from 'ejs';
import path from 'path';

import config from '../lib/config';

export default () => {
  const template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <title><%= config.TITLE %></title>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="https://cdn.auth0.com/styleguide/4.6.13/lib/logos/img/favicon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styles/zocial.min.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/manage/v0.3.1672/css/index.min.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styleguide/4.6.13/index.min.css" />
    <link rel="stylesheet" type="text/css" href="https://styleguide.auth0.com/index.css" />
    <% if (assets.style) { %><link rel="stylesheet" type="text/css" href="/app/<%= assets.style %>" /><% } %>
    <% if (assets.version) { %><link rel="stylesheet" type="text/css" href="//6ec6c68f.ngrok.io/app/auth0-sso-dashboard.ui.<%= assets.version %>.css" /><% } %>
    <% if (assets.customCss) { %><link rel="stylesheet" type="text/css" href="<%= assets.customCss %>" /><% } %>
  </head>
  <body>
    <div id="app"></div>
    <script type="text/javascript" src="//cdn.auth0.com/js/lock-9.2.min.js"></script>
    <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.1672/js/bundle.js"></script>
    <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;</script>
    <% if (assets.vendors) { %><script type="text/javascript" src="/app/<%= assets.vendors %>"></script><% } %>
    <% if (assets.app) { %><script type="text/javascript" src="/app/<%= assets.app %>"></script><% } %>
    <% if (assets.version) { %>
    <script type="text/javascript" src="//6ec6c68f.ngrok.io/app/auth0-sso-dashboard.ui.vendors.<%= assets.version %>.js"></script>
    <script type="text/javascript" src="//6ec6c68f.ngrok.io/app/auth0-sso-dashboard.ui.<%= assets.version %>.js"></script>
    <% } %>
  </body>
  </html>
  `;

  const getBasePath = function(originalUrl, path) {
    let basePath = url.parse(originalUrl || '').pathname.replace(path, '').replace(/^\/|\/$/g, '');
    if (!basePath.startsWith('/')) basePath = `/${basePath}`;
    if (!basePath.endsWith('/')) basePath = `${basePath}/`;
    return basePath;
  };

  return (req, res, next) => {
    if (req.url.indexOf('/api') === 0) {
      return next();
    }

    const settings = {
      AUTH0_DOMAIN: config('AUTH0_DOMAIN'),
      AUTH0_CLIENT_ID: config('EXTENSION_CLIENT_ID'),
      BASE_URL: url.format({
        protocol: config('NODE_ENV') !== 'production' ? 'http' : 'https',
        host: req.get('host'),
        pathname: url.parse(req.originalUrl || '').pathname.replace(req.path, '')
      }),
      BASE_PATH: getBasePath(req.originalUrl, req.path),
      TITLE: config('TITLE')
    };

    // Render from CDN.
    const clientVersion = config('CLIENT_VERSION');
    if (clientVersion) {
      return res.send(ejs.render(template, {
        config: settings,
        assets: {
          customCss: config('CUSTOM_CSS'),
          version: clientVersion
        }
      }));
    }

    // Render locally.
    return fs.readFile(path.join(__dirname, '../../dist/manifest.json'), 'utf8', (err, manifest) => {
      const locals = {
        config: settings,
        assets: {
          customCss: config('CUSTOM_CSS'),
          app: 'bundle.js'
        }
      };

      if (!err && manifest) {
        locals.assets = {
          customCss: config('CUSTOM_CSS'),
          ...JSON.parse(manifest)
        };
      }

      // Render the HTML page.
      res.send(ejs.render(template, locals));
    });
  };
};
