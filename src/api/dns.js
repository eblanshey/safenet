module.exports = {
  getLongNames: function () {
    return this.Request.get('/dns').auth().execute();
  },

  createLongName: function (longName) {
    return this.Request.post('/dns/' + encodeURIComponent(longName)).auth().execute()
  }
};