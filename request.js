var nacl = require('tweetnacl'),
    base64 = require('base64-js');

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
    .then(checkStatus.bind(this), networkError.bind(this))
    .then(prepareResponse.bind(this), safeError.bind(this))
    .catch(genericError.bind(this));
}

// If the server could not be reached at all, this function is used to handle the error.
function networkError(response) {
  throw (new SafeError('network', 'could not connect to SAFE launcher', 0));
}

// If the server COULD be reached but we didn't get a 2xx, handle the error here
function safeError(response) {
  if (response.isSafeError) throw response;

  return response.text().then(function(text) {
    // If authentication was requested, then decrypt the message received.
    if (this._needAuth && doNoDecrypt.indexOf(text) === -1) {
      var encryptedData = base64.toByteArray(text)
      var message = base64.fromByteArray(nacl.secretbox.open(encryptedData, this.Safe.getAuth('symNonce'), this.Safe.getAuth('symKey')));
      message = JSON.parse(atob(message));

      // Sometimes the message returns is an object with a 'description' property
      if (typeof message === 'object') {
        text = message.description;
        code = message.code;
      }

      throw (new SafeError('client', text, code, response));
    } else {
      throw (new SafeError('http', text, response.status, response));
    }
  }.bind(this));
}

// Any other kind of error gets handled here
function genericError(error) {
  if (error.isSafeError) throw error;

  throw (new SafeError('error', error.message, 0));
}

// If request was with auth token, returned data is encrypted, otherwise it's plain ol' json
function prepareResponse(response) {
  return response.text().then(function(text) {
    // If not an authorized request, or not encrypted, no decryption necessary
    if (!this._needAuth || doNoDecrypt.indexOf(text) > -1) {
      return parseJson(text);
    }

    var encryptedData = base64.toByteArray(text);
    var decrypted = base64.fromByteArray(nacl.secretbox.open(encryptedData, this.Safe.getAuth('symNonce'), this.Safe.getAuth('symKey')));

    return JSON.parse(atob(decrypted));
  }.bind(this));
}

// Fetch resolves promise even on non 2xx responses. If we received a 2xx, return response as is.
// If we received an error, then resolve with a response that has the body already decrypted, for convenience.
function checkStatus(response) {
  if (response.ok) {
    Safe.log('Response OK.');
    return Promise.resolve(response)
  } else {
    Safe.log('Response not ok, got status: ', response.status);
    return Promise.reject(response);
  }
}

function SafeError(type, message, status, response) {
  this.isSafeError = true;

  this.type = type;
  this.message = message;
  this.status = status;
  this.response = response;

  this.toString = function() {
    return this.type+' error: '+this.message+' ('+this.status+')';
  }
}

/**
 * Return parsed JSON if needed, otherwise returns text as is.
 * @source http://stackoverflow.com/a/20392392/371699
 * @param text
 */
function parseJson(text) {
  try {
    var o = JSON.parse(text);
    if (o && typeof o === "object" && o !== null)
      return o;
  }
  catch (e) {}

  return text;
}

module.exports.Request = Request;