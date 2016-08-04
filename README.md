# Auth0 Delegated Administration Extension

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
  "AUTHORIZE_API_KEY": "mysecret",
  "EXTENSION_SECRET": "mysecret",
  "WT_URL": "http://localhost:3000/",
  "AUTH0_DOMAIN": "me.auth0.com",
  "AUTH0_CLIENT_ID": "myclientid",
  "AUTH0_CLIENT_SECRET": "myclientsecret"
}
```

Then you can run the extension:

```bash
npm install
npm run serve:dev
```

## Custom Style

Customers can choose to implement their custom style, to do so the following settings can be added:

```json
{
  "TITLE": "Fabrikam User Management",
  "CUSTOM_CSS": "https://rawgithub.com/auth0-extensions/auth0-delegated-administration-extension/master/docs/theme/style.css"
}
```

The CSS file has to be hosted by the customer and can be used to change the style of every component. An example can be found under [docs/theme](docs/theme).
