(function() {
  
  var doc = document;
  var Reqbert;

  Reqbert = function (containerId) {
    var me = this;
    me.scene = new Scene(containerId);

    me.init = function() {
      debug.log('Reqbert init!', me);
    };

    me.start = function() {
      debug.log('Starting Reqbert!');
    };

    me.init();
    return me;
  };

  window.Reqbert = Reqbert;
})();