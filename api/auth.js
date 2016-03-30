var nacl = require('tweetnacl'),
    base64 = require('base64-js');

var utils = require('../utils.js');

module.exports = {
  /**
   * Call this method in order to authenticate with SAFE, using either previous authentication
   * or new.
   *
   * @returns {Promise}
   */
  authenticate: function () {
    // Get stored auth data.
    var stored = this.storage.get();

    // If nothing stored, proceed with new authorization
    if (!stored) {
      this.log('No auth data stored, starting authorization from scratch...');
      return this.auth.authorize(this.app, this.permissions);
    }

    // Otherwise, set the auth data on the Request object so that it can be used for requests
    this.log('Auth data stored, checking validity...');
    this._auth = utils.unserialize(stored);

    // Use the saved auth data to check if we're already authorized. If not, it will clear the stored
    // data, then proceed with new authorization.
    return this.auth.isAuthorized()
      .catch(function (e) {
        if (e.status === 401)
          return this.auth.authorize(this.app, this.permissions);

        throw e;
      });
  },

  authorize: function () {
    this.log('Authorizing...');
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
      .then(function (json) {
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
        this.log('Authorized');
      }.bind(this));
  },

  /**
   * Checks if we're authenticated on the SAFE network
   * @returns {*}
   */
  isAuthorized: function () {
    this.log('Checking if authorized...');
    return this.Request.get('/auth').auth().execute()
      // let's use our own function here, that resolve true or false,
      // rather than throwing an error if invalid token
      .then(function () {
        this.log('Authorized');
        return true;
      }.bind(this), function (response) {
        this.log('Not authorized, or received error.', response);
        if (response.status === 401) {
          // Remove any auth from storage and Request class
          this.log('Not authorized, removing any stored auth data.');
          clearAuthData.call(this);

          // Return false
          return false;
        } else {
          // Any other status is another error, throw the response
          throw response;
        }
      }.bind(this));
  },

  deauthorize: function () {
    this.log('Deauthorizing...');
    return this.Request.delete('/auth').auth().execute()
      .then(function (response) {
        // Clear auth data from storage upon deauthorization
        this.storage.clear();
        clearAuthData.call(this);

        this.log('Deauthorized and cleared from storage.');

        return response;
      }.bind(this));
  }
}

function clearAuthData() {
  this._auth = {
    token: null,
    symKey: null,
    symNonce: null
  };
}