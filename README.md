# Auth0 SSO Dashboard Extension
[![CircleCI](https://circleci.com/gh/auth0-extensions/auth0-sso-dashboard-extension.svg?style=svg)](https://circleci.com/gh/auth0-extensions/auth0-sso-dashboard-extension)
[![Maintainability](https://api.codeclimate.com/v1/badges/c011cabbc344c1bec383/maintainability)](https://codeclimate.com/github/auth0-extensions/auth0-sso-dashboard-extension/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/c011cabbc344c1bec383/test_coverage)](https://codeclimate.com/github/auth0-extensions/auth0-sso-dashboard-extension/test_coverage)

## Running in Production

```bash
npm install
npm run client:build
npm run server:prod
```

## Running in Development

Update the configuration file under `./server/config.json`:

```json
{
  "EXTENSION_CLIENT_ID": "client id of my app",
  "WT_URL": "http://localhost:3000/",
  "PUBLIC_WT_URL": "https://localhost:3000/",
  "AUTH0_RTA": "https://auth0.auth0.com",
  "AUTH0_DOMAIN": "me.auth0.com",
  "AUTH0_CLIENT_ID": "client id of my api client",
  "AUTH0_CLIENT_SECRET": "client secret of my api client"
}
```

There should be 2 clients. One (first) - "Single page application" with only necessary connection enabled and 'RS256' algorithm (advanced settings).
Second (management client) - "Non Interactive" with scopes "read:clients update:clients read:connections read:users read:logs read:device_credentials".

Then you can run the extension:

```bash
npm install
npm run serve:dev
```

## Custom Style

Customers can choose to implement their custom style, to do so the following settings can be added:

```json
{
  "TITLE": "Fabrikam SSO Dashboard",
  "CUSTOM_CSS": "https://cdn.jsdelivr.net/gh/auth0-extensions/auth0-sso-dashboard-extension@master/docs/theme/fabrikam.css"
}
```

The CSS file has to be hosted by the customer and can be used to change the style of every component. An example can be found under [docs/theme](docs/theme).
