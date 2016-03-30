var nacl = require('tweetnacl'),
    base64 = require('base64-js');

var Request = require('./request.js').Factory,
    storage = require('./storage.js');

var namespaces = {
  auth: require('./api/auth.js'),
  dns: require('./api/dns.js')
};

/**
 *
 * @param app obj containing name, version, vendor, and id
 * @param permissions array containing permissions (only SAFE_DRIVE_ACCESS avail)
 * @param conf obj containing instance of storage class to use
 * @constructor
 */
function Safe(app, permissions, conf) {
  permissions = permissions || [];
  conf = conf || {};

  if (!app.name || !app.version || !app.vendor || !app.id) {
    throw new Error('`app` must be an object containing name, version, vendor, and id.')
  }

  // Set the storage class to be used for saving/fetching auth data
  if (conf.storage) {
    this.storage = conf.storage;
  } else {
    if (typeof localStorage !== 'undefined') {
      this.storage = storage.localStorage;
    } else {
      throw new Error('Default storage is localStorage, which is not present in this environment.' +
      ' You must provide a storage class that has the `set`, `get`, and `clear` methods.');
    }
  }

  this.app = app;
  this.permissions = permissions;
  this.Request = new Request(this);

  // Bind namespace api endpoints
  bindNamespaces.call(this);

  Safe.log('Instantiated new Safe instance.');
}

// All we're doing here is A) namespacing api calls (e.g. call using Safe.dns.getLongName() vs
// Safe.getLongName(), and B) binding "this" within each api call to the main Safe object
function bindNamespaces() {
  for (var namespace in namespaces) {
    for (var func in namespaces[namespace]) {
      namespaces[namespace][func] = namespaces[namespace][func].bind(this);
    }

    this[namespace] = namespaces[namespace];
  };
}

// Set up logging capability that can be overridden by the useur
Safe.log = function() {}
// Make it accessible from the Safe instance
Safe.prototype.log = function() {
  this.constructor.log.apply(this, arguments);
}

// Helper to get auth data
Safe.prototype.getAuth = function(key) {
  return !key ? this._auth : this._auth[key];
}

module.exports = Safe;