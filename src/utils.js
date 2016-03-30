base64 = require('base64-js');

module.exports.unserialize = function(encoded) {
  var obj = JSON.parse(encoded);

  return {
    token: obj.token,
    symKey: base64.toByteArray(obj.symKey),
    symNonce: base64.toByteArray(obj.symNonce)
  };
}

module.exports.serialize = function(auth) {
  var obj = {
    token: auth.token,
    symKey: base64.fromByteArray(auth.symKey),
    symNonce: base64.fromByteArray(auth.symNonce)
  };

  return JSON.stringify(obj);
}
