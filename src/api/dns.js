module.exports = {
  getLongNames: function() {
    return this.Request.get('/dns').auth().execute();
  },

  createLongName: function(longName) {
    return this.Request.post('/dns/' + encodeURIComponent(longName)).auth().execute()
  },

  createService: function(payload) {
    return this.Request.post('/dns').auth().body(payload).execute()
  },

  getServiceDir: function(serviceName, longName) {
    return this.Request.get('/dns/'+encodeURIComponent(serviceName)+'/'+encodeURIComponent(longName)).auth().execute();
  }
};