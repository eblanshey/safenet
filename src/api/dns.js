module.exports = {
  listNames: function() {
    return this.Request.get('/dns').auth().execute();
  },

  createName: function(name) {
    return this.Request.post('/dns/' + encodeURIComponent(name)).auth().execute();
  },

  deleteName: function(name) {
    return this.Request.delete('/dns/' + encodeURIComponent(name)).auth().execute();
  },

  listServices: function(name) {
    return this.Request.get('/dns/'+encodeURIComponent(name)).auth().execute();
  },

  createServiceAndName: function(payload) {
    return this.Request.post('/dns').auth().body(payload).execute();
  },

  createServiceForName: function(payload) {
    return this.Request.put('/dns').auth().body(payload).execute();
  },

  getServiceDir: function(serviceName, name) {
    // Surprise! You can't authenticate this request.
    return this.Request.get('/dns/'+encodeURIComponent(serviceName)+'/'+encodeURIComponent(name)).execute();
  },

  getFile: function(serviceName, name, filePath, options) {
    var query = {};
    if (options.offset) query.offset = options.offset;
    if (options.length) query.length = options.length;

    return this.Request
      .get('/dns/'+encodeURIComponent(serviceName)+'/'+encodeURIComponent(name)+'/'+encodeURIComponent(filePath))
      .query(query)
      .returnMeta()
      .execute();
  },

  deleteService: function(serviceName, name) {
    return this.Request.delete('/dns/'+encodeURIComponent(serviceName)+'/'+encodeURIComponent(name)).auth().execute();
  }
};