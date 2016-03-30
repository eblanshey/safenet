var nacl = require('tweetnacl'),
    base64 = require('base64-js');

var Request = require('./request.js').Factory,
    storage = require('./storage.js'),
    utils = require('./utils.js');

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

  clearAuthData.call(this);

  Safe.log('Instantiated new Safe instance.');
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

/**
 * Call this method in order to authenticate with SAFE, using either previous authentication
 * or new.
 *
 * @returns {Promise}
 */
Safe.prototype.authenticate = function() {
  // Get stored auth data.
  var stored = this.storage.get();

  // If nothing stored, proceed with new authorization
  if (!stored) {
    Safe.log('No auth data stored, starting authorization from scratch...');
    return this.authorize(this.app, this.permissions);
  }

  // Otherwise, set the auth data on the Request object so that it can be used for requests
  Safe.log('Auth data stored, checking validity...');
  this._auth = utils.unserialize(stored);

  // Use the saved auth data to check if we're already authorized. If not, it will clear the stored
  // data, then proceed with new authorization.
  return this.isAuthorized()
    .catch(function(e) {
      if (e.status === 401)
        return this.authorize(this.app, this.permissions);

      throw e;
    });
}

Safe.prototype.authorize = function() {
  Safe.log('Authorizing...');
  // Generate new asymmetric key pair and nonce, e.g. public-key encryption
  var asymKeys  = nacl.box.keyPair(),
      asymNonce = nacl.randomBytes(nacl.box.nonceLength);

  // The payload for the request
  var authPayload = {
    app: this.app,
    publicKey: base64.fromByteArray(asymKeys.publicKey),
    nonce: base64.fromByteArray(asymNonce),
    permissions: this.permissions
  };

  // Proceed with request
  return this.Request
    .post('/auth')
    .body(authPayload)
    .execute()
    .then(function(json) {
      // We received the launcher's private key + encrypted symmetrical keys (i.e. private key encryption)
      var launcherPubKey = base64.toByteArray(json.publicKey);
      var messageWithSymKeys = base64.toByteArray(json.encryptedKey);

      // Decrypt the private key/nonce
      var key = nacl.box.open(messageWithSymKeys, asymNonce, launcherPubKey, asymKeys.secretKey);

      // Save auth data for future requests
      this._auth = {
        token: json.token,
        symKey: key.slice(0, nacl.secretbox.keyLength),
        symNonce: key.slice(nacl.secretbox.keyLength)
      };

      // Set the auth data for future requests
      this.storage.set(utils.serialize(this._auth));
      Safe.log('Authorized');
    }.bind(this));
}

/**
 * Checks if we're authenticated on the SAFE network
 * @returns {*}
 */
Safe.prototype.isAuthorized = function() {
  Safe.log('Checking if authorized...');
  return this.Request.get('/auth').auth().execute()
    // let's use our own function here, that resolve true or false,
    // rather than throwing an error if invalid token
    .then(function() {
      Safe.log('Authorized');
      return true;
    }, function(response) {
      Safe.log('Not authorized, or received error.', response);
      if (response.status === 401) {
        // Remove any auth from storage and Request class
        Safe.log('Not authorized, removing any stored auth data.');
        clearAuthData.call(this);

        // Return false
        return false;
      } else {
        // Any other status is another error, throw the response
        throw response;
      }
    }.bind(this));
}

Safe.prototype.deauthorize = function() {
  Safe.log('Deauthorizing...');
  return this.Request.delete('/auth').auth().execute()
    .then(function(response) {
      // Clear auth data from storage upon deauthorization
      this.storage.clear();
      clearAuthData.call(this);

      Safe.log('Deauthorized and cleared from storage.');

      return response;
    }.bind(this));
}

Safe.prototype.getLongNames = function() {
  return this.Request.get('/dns').auth().execute();
};

Safe.prototype.createLongName = function(longName) {
  return this.Request.post('/dns/'+encodeURIComponent(longName)).auth().execute()
};

function clearAuthData() {
  this._auth = {
    token: null,
    symKey: null,
    symNonce: null
  };
}

module.exports = Safe;