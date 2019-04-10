const settings = { };
let currentProvider = null;


const boolify = (item) => {
  // as we're trying to "boolify" every secret, we need to make sure we're processing only boolean secrets
  if (item === 'true' || item === 'false') {
    return item === 'true';
  }

  return item;
};

const config = (key) => {
  if (settings && settings[key]) {
    return boolify(settings[key]);
  }

  if (!currentProvider) {
    throw new Error('A configuration provider has not been set');
  }

  if (key === 'AUTH0_CUSTOM_DOMAIN') {
    return currentProvider('AUTH0_CUSTOM_DOMAIN') || currentProvider('AUTH0_DOMAIN');
  }

  if (key === 'IS_APPLIANCE') {
    return config('AUTH0_RTA') && config('AUTH0_RTA').replace('https://', '') !== 'auth0.auth0.com';
  }

  return boolify(currentProvider(key));
};

config.setProvider = (providerFunction) => {
  currentProvider = providerFunction;
};

config.setValue = (key, value) => {
  settings[key] = value;
};

module.exports = config;
