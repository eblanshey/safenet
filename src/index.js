require('./init.js');

var Safe = require('./safe.js');

// If Node environment, export Safe. Otherwise, attach to window.
if (typeof process === 'object' && process+'' === '[object process]') {
  module.exports = Safe;
} else {
  window.SafeApp = Safe;
}
