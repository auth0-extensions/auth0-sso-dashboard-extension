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

  return boolify(currentProvider(key));
};

config.setProvider = (providerFunction) => {
  currentProvider = providerFunction;
};

config.setValue = (key, value) => {
  settings[key] = value;
};

module.exports = config;
