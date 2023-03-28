const config = require('config');

const IConfig = {
  homeserverUrl: '',
  accessToken: '',
  autoJoin: false,
  dataPath: '',
  encryption: false,
};

module.exports = Object.assign({}, IConfig, config);