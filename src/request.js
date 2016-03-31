var nacl   = require('tweetnacl'),
    base64 = require('base64-js');

var utils = require('./utils.js');

// This is a list of plain text body responses that the SAFE client returns.
// If the response body contains any of these, then we know that decryption is not required.
var doNoDecrypt = ['OK', 'Accepted', 'Unauthorized', 'Server Error'];

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
  this._returnMeta = false;
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

/**
 * Some requests, such as getting a file, have useful meta data in the headers that we want
 * to keep. In those cases, return an object that has "body" and "meta" properties.
 * @returns {Request}
 */
Request.prototype.returnMeta = function() {
  this._returnMeta = true;
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

    // Encrypt body if needed
    if (this._needAuth)
      payload.body = encrypt.call(this, payload.body);
  }

  // Add token if requested
  // Even if token is null, we'll still continue, as this may be a request to check if we're
  // authorized or not, in which case a 401 will automatically be returned.
  if (this._needAuth)
    payload.headers['Authorization'] = 'Bearer ' + this.Safe.getAuth('token');

  // POST and PUT requests usually have a request body.
  // They should be JSON (unencrypted) or text (encrypted)
  if (['POST', 'PUT'].indexOf(payload.method) > -1)
    payload.headers['Content-Type'] = this._needAuth ? 'text/plain' : 'application/json';

  Safe.log('Executing request with uri "'+this.uri+'" and payload: ', payload);

  // Send request, check status, get response data, and decrypt if necessary
  return fetch(Request.baseUrl + this.uri, payload)
    .then(prepareResponse.bind(this), networkError.bind(this))
    .catch(genericError.bind(this))
}

// If request was with auth token, returned data is encrypted, otherwise it's plain ol' json
function prepareResponse(response) {
  Safe.log('Received response: ', response);
  return response.text().then(function(text) {
    // If we get a 2xx...
    Safe.log('Launcher returned status '+response.status);
    if (response.ok) {
      // If not an authorized request, or not encrypted, no decryption necessary
      if (!this._needAuth || doNoDecrypt.indexOf(text) > -1)
        var body = utils.parseJson(text);

      // Otherwise, decrypt response
      else
        var body = decrypt.call(this, text);

      // Lastly, if any meta data was requested (e.g. the headers), then return an object
      if (this._returnMeta) {
        return {body: body, meta: response.headers.entries()};
      } else {
        return body;
      }
    } else {
      // If authentication was requested, then decrypt the error message received.
      if (this._needAuth && doNoDecrypt.indexOf(text) === -1) {
        var status = response.status;
        var message = decrypt.call(this, text);

        // Sometimes the message returns is an object with a 'description' and errorCode property
        if (typeof message === 'object') {
          status = message.errorCode;
          message = message.description;
        }

        // Throw a "launcher" error type, which is an error from the launcher.
        throw new SafeError('launcher', message, status, response);
      } else {
        // If no message received, it's a standard http response error
        throw new SafeError('http', text, response.status, response);
      }
    }
  }.bind(this));
}

// If the server could not be reached at all, this function is used to handle the error.
// Non-2xx responses get handled like normal by prepareResponse()
function networkError(response) {
  throw (new SafeError('network', 'Could not connect to SAFE launcher'));
}

// Any other kind of error gets handled here
function genericError(error) {
  if (error.isSafeError) throw error;

  throw (new SafeError('error', error.message, 0));
}

function SafeError(type, message, status, response) {
  this.isSafeError = true;

  this.type = type;
  this.message = message;
  this.status = status || 0;
  this.response = response;

  this.toString = function() {
    return this.type+': '+this.message+' ('+this.status+')';
  }
}

function decrypt(text) {
  var encryptedData = base64.toByteArray(text);
  var message = base64.fromByteArray(nacl.secretbox.open(encryptedData, this.Safe.getAuth('symNonce'), this.Safe.getAuth('symKey')));

  return utils.parseJson(atob(message));
}

function encrypt(text) {
  var encrypted = nacl.secretbox(utils.encodeUTF8(text), this.Safe.getAuth('symNonce'), this.Safe.getAuth('symKey'));
  return base64.fromByteArray(encrypted);
}

module.exports.Request = Request;