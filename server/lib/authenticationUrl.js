import config from './config';

module.exports = (app) => {
  const authProtocol = app.type;
  const callback = app.callback || '';
  const domain = config('AUTH0_DOMAIN');
  const clientId = app.client;
  const responseType = app.response_type || 'code';
  const scope = app.scope || 'openid';

  let loginUrl = '';
  switch (authProtocol) {
    case 'saml':
      loginUrl = `https://${domain}/samlp/${clientId}`;
      break;
    case 'wsfed':
      loginUrl = `https://${domain}/wsfed/${clientId}?wreply=${callback}`;
      break;
    default:
    case 'oidc':
      loginUrl = `https://${domain}/authorize?response_type=${responseType}&scope=${scope}&client_id=${clientId}&redirect_uri=${encodeURIComponent(callback)}`;
      break;
  }

  if (app.connection) {
    loginUrl += (loginUrl.indexOf('?') >0) ? ((authProtocol === 'wsfed') ? '&whr=' : '&connection=') : ((authProtocol === 'wsfed') ? '?whr=' : '?connection=')
    loginUrl += app.connection;
  }

  return loginUrl;
};
