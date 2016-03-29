// enable fetch globally
require('isomorphic-fetch');
require('es6-promise').polyfill();

var Safe = require('./safe.js');

window.Safe = Safe;

module.exports = Safe;
