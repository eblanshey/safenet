// enable fetch globally
require('isomorphic-fetch');
require('es6-promise').polyfill();

var nacl = require('tweetnacl'),
		base64 = require('base64-js'),
		clone = require('lodash/cloneDeep');

var symKey, symNonce, authToken;

var checkStatus = function(response) {
	if (response.ok) {
		return Promise.resolve(response)
	} else {
		return Promise.reject(response)
	}
}

var toJson = function(response) {
	return response.json();
}

var toText = function(response) {
	return response.text();
}

function Safe() {

}

Safe.prototype.authorize = function(app, permissions) {
  if (!app.name || !app.version || !app.vendor || !app.id) {
    throw new Error('`app` must be an object containing name, version, vendor, and id.')
  }

  permissions = permissions || [];
	app = clone(app);

	var asymKeys = nacl.box.keyPair();
	var asymNonce = nacl.randomBytes(nacl.box.nonceLength);

	var authPayload = {
		app: app,
		publicKey: base64.fromByteArray(asymKeys.publicKey),
		nonce: base64.fromByteArray(asymNonce),
		permissions: permissions
	};

	return fetch('http://api.safenet/auth', {
		mode: 'cors',
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify(authPayload)
	})
		.then(checkStatus)
		.then(toJson)
		.then(function(response) {
			var launcherPubKey = base64.toByteArray(response.publicKey);
			authToken = response.token;
			var messageWithSymKeys = base64.toByteArray(response.encryptedKey);
			var key = nacl.box.open(messageWithSymKeys, asymNonce, launcherPubKey, asymKeys.secretKey);
			symKey = key.slice(0, nacl.secretbox.keyLength);
			symNonce = key.slice(nacl.secretbox.keyLength);
		});
}

Safe.prototype.isAuthorized = function() {
	return fetch('http://api.safenet/auth', {
		mode: 'cors',
		headers: {
			'Authorization': 'Bearer ' + authToken
		}
	})
		// let's use our own function here, that resolve true or false,
		// rather than throwing an error if invalid token
		.then(function(response) {
			return response.ok ? true : false;
		});
	// TODO: there can still be a network error, catch it
}

Safe.prototype.unauthorize = function() {
	return fetch('http://api.safenet/auth', {
		mode: 'cors',
		method: 'DELETE',
		headers: {
			'Authorization': 'Bearer ' + authToken
		}
	})
		.then(checkStatus)
		.catch(function (response) {
			return response.text().then(function(text) {
				var message = 'unauthorize Failed: \n status: ' + response.status + '\n Msg: ' + text;
				console.log(message);
				throw new Error(message);
			})
		})
		.then(function(response) {
			return response.ok ? true : false;
		});
	// TODO: there can still be a network error, catch it
}

Safe.prototype.getLongNames = function() {
	return fetch('http://api.safenet/dns', {
		mode: 'cors',
		headers: {
			'Authorization': 'Bearer ' + authToken
		}
	})
		.then(checkStatus)
		.catch(function (response) {
			return response.text().then(function(text) {
				var message = 'getLongNames Failed: \n status: ' + response.status + '\n Msg: ' + text;
				console.log(message);
				throw new Error(message);
			})
		})
		.then(toText)
		.then(function(text) {
			var encryptedData = base64.toByteArray(text);
			var publicIds = base64.fromByteArray(nacl.secretbox.open(encryptedData, symNonce, symKey));

			return JSON.parse(atob(publicIds));
		});
};

Safe.prototype.createLongName = function(longName) {
	return fetch('http://api.safenet/dns/'+encodeURIComponent(longName), {
		mode: 'cors',
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + authToken
		}
	})
		.then(checkStatus)
		// No additional then() needed here if 200 status. There is no response.
		.catch(function (response) {
			return response.text().then(function(text) {
				if (response.status === 401) {
					var message = 'createLongName Failed: \n status: ' + response.status + '\n Msg: ' + text;
				} else {
					var encryptedData = base64.toByteArray(text);
					var message = base64.fromByteArray(nacl.secretbox.open(encryptedData, symNonce, symKey));
					// TODO: if request is GET and name not found, it returns non-standard error object. should I report?
					message = JSON.parse(atob(message));
					message = message.description;
				}

				console.log(message);
				throw new Error(message);
			})
		});
};

window.Safe = Safe;

module.exports = Safe;
