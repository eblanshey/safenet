var toUTF8 = require('../utils.js').decodeUTF8;

module.exports = {
  createDirectory: function(dir, options) {
    var payload = Object.assign({}, {dirPath: dir}, options);
    console.log('payload', payload);
    return this.Request.post('/nfs/directory').auth().body(payload).execute();
  },

  getDirectory: function(dir, options) {
    return this.Request.get('/nfs/directory/'+encodeURIComponent(dir)+'/'+isPathShared(options.isPathShared)).auth().execute();
  },

  deleteDirectory: function(dir, options) {
    return this.Request.delete('/nfs/directory/'+encodeURIComponent(dir)+'/'+isPathShared(options.isPathShared)).auth().execute();
  },

  createFile: function(file, options) {
    var payload = Object.assign({}, {filePath: file}, options);
    return this.Request.post('/nfs/file').auth().body(payload).execute();
  },

  updateFile: function(file, content, options) {
    // If content is a TypedArray, then convert it to a string first.
    if (ArrayBuffer.isView(content)) content = toUTF8(content);

    return this.Request.put('/nfs/file/'+encodeURIComponent(file)+'/'+isPathShared(options.isPathShared)).auth().body(content).execute();
  },

  getFile: function(file, options) {
    return this.Request.get('/nfs/file/'+encodeURIComponent(file)+'/'+isPathShared(options.isPathShared)).auth().execute();
  },

  deleteFile: function(file, options) {
    return this.Request.delete('/nfs/file/'+encodeURIComponent(file)+'/'+isPathShared(options.isPathShared)).auth().execute();
  }

};

/**
 * Returns a string "true" or "false"
 *
 * @param isPathShared
 * @returns {string}
 */
function isPathShared(isPathShared) {
  if (typeof isPathShared === 'string') {
    return isPathShared === 'true' ? 'true' : 'false';
  } else {
    return isPathShared ? 'true' : 'false';
  }
}