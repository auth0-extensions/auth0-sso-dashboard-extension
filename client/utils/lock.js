let lockInstance = null;

function getLock() {
  if (window.config.AUTH0_CLIENT_ID && !lockInstance) {
    lockInstance = new Auth0Lock(config.AUTH0_CLIENT_ID, config.AUTH0_DOMAIN, {   // eslint-disable-line no-undef
      auth: {
        params: {
          popup: true,
          scope: 'openid name email nickname groups roles app_metadata authorization read:applications',
          audience: 'urn:sso-dashboard-api'
        }
      }
    });
  }

  return lockInstance;
}

export function show(returnUrl) {
  const lock = getLock();
  if (!lock) {
    throw new Error('Unable to create the Lock.');
  }

  lock.show({
    closable: false,
    disableSignupAction: true,
    responseType: 'id_token token',
    callbackURL: `${window.config.BASE_URL}/login`,
    callbackOnLocationHash: true,
    authParams: {
      state: returnUrl
    }
  });
}
