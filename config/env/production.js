var AWS = require('aws-sdk'),
    cfenv = require('cfenv'),
    appEnv = cfenv.getAppEnv(),
    dbURL = appEnv.getServiceURL('federalist-database'),
    s3Creds = appEnv.getServiceCreds('s3-sb-federalist.18f.gov'),
    redisCreds = appEnv.getServiceCreds('federalist-redis');

/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {
  grunt: {
    _hookTimeout: 60 * 1000
  }
};

// If running in Cloud Foundry with a service database avaible, use it
if (dbURL) {
  module.exports.connections = {
    postgres: {
      adapter: 'sails-postgresql',
      url: dbURL
    }
  };
  module.exports.models = {
    connection: 'postgres'
  };
}

// If running in Cloud Foundry with an S3 credential service available
if (s3Creds) {
  AWS.config.update({
    accessKeyId: s3Creds.access_key,
    secretAccessKey: s3Creds.secret_key
  });
}

// If running in Cloud Foundry with a redis service
if (redisCreds) {
  module.exports.session = {
    adapter: 'redis',
    host: redisCreds.hostname,
    port: redisCreds.port,
    db: 0,
    pass: redisCreds.password
  };
  module.exports.sockets = {
    adapter: 'socket.io-redis',
    host: redisCreds.hostname,
    port: redisCreds.port,
    db: 1,
    pass: redisCreds.password
  };
}
