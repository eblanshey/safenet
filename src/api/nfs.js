var toUTF8 = require('../utils.js').decodeUTF8;

module.exports = {
  createDirectory: function(dir, options) {
    // Metadata needs to be base64 encoded
    if (options && options.metadata) options.metadata = btoa(options.metadata);

    var payload = Object.assign({}, {dirPath: dir}, options);
    return this.Request.post('/nfs/directory').auth().body(payload).execute();
  },

  getDirectory: function(dir, options) {
    return this.Request
      .get('/nfs/directory/'+encodeURIComponent(dir)+'/'+pathSharedString(options.isPathShared))
      .auth()
      .execute()
      .then(function(dir) {
        // Metadata needs to be base64 decoded
        if (dir.info.metadata) dir.info.metadata = atob(dir.info.metadata);

        return dir;
      });
  },

  deleteDirectory: function(dir, options) {
    return this.Request.delete('/nfs/directory/'+encodeURIComponent(dir)+'/'+pathSharedString(options.isPathShared)).auth().execute();
  },

  createFile: function(file, options) {
    // Metadata needs to be base64 encoded
    if (options && options.metadata) options.metadata = btoa(options.metadata);

    var payload = Object.assign({}, {filePath: file}, options);
    return this.Request.post('/nfs/file').auth().body(payload).execute();
  },

  updateFile: function(file, content, options) {
    // If content is a TypedArray, then convert it to a string first.
    if (ArrayBuffer.isView(content)) content = toUTF8(content);

    var query = {};
    if (options.offset) query.offset = options.offset;

    return this.Request.put('/nfs/file/'+encodeURIComponent(file)+'/'+pathSharedString(options.isPathShared))
      .auth().body(content).query(query).execute();
  },

  getFile: function(file, options) {
    var query = {};
    if (options.offset) query.offset = options.offset;
    if (options.length) query.length = options.length;
    return this.Request
      .get('/nfs/file/'+encodeURIComponent(file)+'/'+pathSharedString(options.isPathShared))
      .query(query)
      .auth()
      .returnMeta()
      .execute();
  },

  deleteFile: function(file, options) {
    return this.Request.delete('/nfs/file/'+encodeURIComponent(file)+'/'+pathSharedString(options.isPathShared)).auth().execute();
  }

};

/**
 * Returns a string "true" or "false"
 *
 * @param isPathShared
 * @returns {string}
 */
function pathSharedString(isPathShared) {
  if (typeof isPathShared === 'string') {
    return isPathShared === 'true' ? 'true' : 'false';
  } else {
    return isPathShared ? 'true' : 'false';
  }
}