var base64 = require('base64-js'),
    nacl = require('tweetnacl');

/**
 * Serializes auth data.
 * @param encoded
 * @returns {{token: *, symKey: *, symNonce: *}}
 */
module.exports.unserialize = function(encoded) {
  var obj = JSON.parse(encoded);

  return {
    token: obj.token,
    symKey: base64.toByteArray(obj.symKey),
    symNonce: base64.toByteArray(obj.symNonce)
  };
};

/**
 * Unserializes auth data.
 * @param auth
 */
module.exports.serialize = function(auth) {
  var obj = {
    token: auth.token,
    symKey: base64.fromByteArray(auth.symKey),
    symNonce: base64.fromByteArray(auth.symNonce)
  };

  return JSON.stringify(obj);
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
};
module.exports.parseJson = parseJson;

/**
 * @source https://github.com/dchest/tweetnacl-util-js/blob/master/nacl-util.js#L16
 * @param s
 * @returns {Uint8Array}
 */
function encodeUTF8(s) {
  var i, d = unescape(encodeURIComponent(s)), b = new Uint8Array(d.length);
  for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
  return b;
};
module.exports.encodeUTF8 = encodeUTF8;

/**
 * @source https://github.com/dchest/tweetnacl-util-js/blob/master/nacl-util.js#L22
 * @param arr
 * @returns {string}
 */
function decodeUTF8(arr) {
  var i, s = [];
  for (i = 0; i < arr.length; i++) s.push(String.fromCharCode(arr[i]));
  return decodeURIComponent(escape(s.join('')));
};
module.exports.decodeUTF8 = decodeUTF8;

module.exports.decrypt = function(text, nonce, key) {
  var encryptedData = base64.toByteArray(text);
  var message = base64.fromByteArray(nacl.secretbox.open(encryptedData, nonce, key));

  return parseJson(atob(message));
}

module.exports.encrypt = function(text, nonce, key) {
  var encrypted = nacl.secretbox(encodeUTF8(text), nonce, key);
  return base64.fromByteArray(encrypted);
}