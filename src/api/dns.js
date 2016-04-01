module.exports = {
  listNames: function() {
    return this.Request.get('/dns').auth().execute();
  },

  createName: function(name) {
    return this.Request.post('/dns/' + encodeURIComponent(name)).auth().execute()
  },

  listServices: function(name) {
    return this.Request.get('/dns/'+encodeURIComponent(name)).auth().execute();
  },

  createServiceAndName: function(payload) {
    return this.Request.post('/dns').auth().body(payload).execute()
  },

  createServiceForName: function(payload) {
    return this.Request.put('/dns').auth().body(payload).execute()
  },

  getServiceDir: function(serviceName, name) {
    // Surprise! You can't authenticate this request.
    return this.Request.get('/dns/'+encodeURIComponent(serviceName)+'/'+encodeURIComponent(name)).execute();
  },

  getFile: function(serviceName, name, filePath, options) {
    return this.Request.get(
      '/dns/'+encodeURIComponent(serviceName)+'/'+encodeURIComponent(name)+'/'+encodeURIComponent(filePath)
    ).execute();
  }
};