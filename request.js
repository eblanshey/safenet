var nacl = require('tweetnacl'),
    base64 = require('base64-js');

/**
 * The factory will create new requests to the launcher, passing in the Safe instance,
 * which is used for the auth data.
 *
 * @param Safe
 * @returns {RequestFactory}
 * @constructor
 */
function RequestFactory(Safe) {
  if (!this)
    return new RequestFactory(Safe);

  this.Safe = Safe;
}

module.exports.Factory = RequestFactory;

// The exposed HTTP methods on the factory: get, post, put, and delete
RequestFactory.prototype.get = function(uri) {
  return new Request(this.Safe, uri, 'GET');
}
RequestFactory.prototype.post = function(uri) {
  return new Request(this.Safe, uri, 'POST');
}
RequestFactory.prototype.put = function(uri) {
  return new Request(this.Safe, uri, 'PUT');
}
RequestFactory.prototype.delete = function(uri) {
  return new Request(this.Safe, uri, 'DELETE');
}

/**
 * The main function for creating new Requests to SAFE
 *
 * @param Safe
 * @param uri
 * @param method
 * @returns {Request}
 * @constructor
 */
function Request(Safe, uri, method) {
  if (!this)
    return new Request(Safe, uri, method);

  this.Safe = Safe;
  this.uri = uri;
  this.method = method;
  this._needAuth = false;
}

// This could also just be http://localhost:8100/
Request.baseUrl = 'http://api.safenet';

// Add a body to the request
Request.prototype.body = function(body) {
  this._body = body;
  return this;
}

// Require both authentication (the token) and encryption/decryption
// of the request/response bodies, if required. We're coupling encryption and auth together for now
// because usually authentication implies encryption.
Request.prototype.auth = function() {
  this._needAuth = true;
  return this;
}

// Send the request
Request.prototype.execute = function() {
  var payload = {};

  payload.method = this.method.toUpperCase();
  payload.mode = 'cors';
  payload.headers = {};

  if (this._body) {
    // If body is not a string, make it a string
    payload.body = typeof this._body !== 'string' ? JSON.stringify(this._body) : this._body;
  }

  // Add token if requested
  if (this._needAuth) {
    // Even if token is null, we'll still continue, as this may be a request to check if we're
    // authorized or not, in which case a 401 will automatically be returned.
    payload.headers['Authorization'] = 'Bearer ' + this.Safe.getAuth('token');
  }

  // POST and PUT requests usually have a request body.
  // They should be JSON (unencrypted) or text (encrypted)
  if (['POST', 'PUT'].indexOf(payload.method) > -1) {
    payload.headers['Content-Type'] = this._needAuth ? 'text/plain' : 'application/json';
  }

  Safe.log('Executing request with uri "'+this.uri+'" and payload: ', payload);

  // Send request, check status, get response data, and decrypt if necessary
  return fetch(Request.baseUrl + this.uri, payload)
    .then(this._checkStatus.bind(this))
    .then(this._responseData.bind(this))
    .then(this._decrypt.bind(this));
}

// If request was with auth token, returned data is encrypted, otherwise it's plain ol' json
Request.prototype._responseData = function(response) {
  return this._needAuth ? response.text() : response.json();
}

var doNoDecrypt = ['OK', 'Accepted', 'Unauthorized', 'Server Error'];

// Decrypt message if necessary
Request.prototype._decrypt = function(message) {
  // If not an authorized request, or not encrypted, no decryption necessary
  if (!this._needAuth || doNoDecrypt.indexOf(message) > -1) {
    return message;
  }

  var encryptedData = base64.toByteArray(message);
  var decrypted = base64.fromByteArray(nacl.secretbox.open(encryptedData, this.Safe.getAuth('symNonce'), this.Safe.getAuth('symKey')));

  return JSON.parse(atob(decrypted));
}

// Fetch resolves promise even on non 2xx responses. If we received a 2xx, return response as is.
// If we received an error, then resolve with a response that has the body already decrypted, for convenience.
Request.prototype._checkStatus = function(response) {
  if (response.ok) {
    Safe.log('Response OK.');
    return Promise.resolve(response)
  } else {
    // If no auth requested, or response is a 401, response is already in plaintext.
    var is401 = response.status === 401;
    Safe.log('Response not ok, got status', response.status);

    if (!this._needAuth || is401) {
      Safe.log('Decryption not required, continuing.');
      return Promise.reject(response)
    }

    // Create a new response object that has the message decrypted.
    return response.text().then(function(text) {
      var encryptedData = base64.toByteArray(text)
      var message = base64.fromByteArray(nacl.secretbox.open(encryptedData, this.Safe.getAuth('symNonce'), this.Safe.getAuth('symKey')));
      message = JSON.parse(atob(message));

      // Sometimes the message returns is an object with a 'description' property
      if (typeof message === 'object' && message.description) {
        message = message.description;
      }

      throw new Response(message, {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText
      });
    });
  }
}

module.exports.Request = Request;