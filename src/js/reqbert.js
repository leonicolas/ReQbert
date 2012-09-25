(function() {
  var Reqbert;

  Reqbert = function (containerId) {
    var me = this;
    
    me._scene = new Scene(containerId);
    me._state = Reqbert.GameState.stoped;
    
    me._init = function() {
      debug.log('Reqbert init!', me);
    };

    me.start = function() {
      debug.log('Starting Reqbert!');
      me._state = Reqbert.GameState.running;
    };

    me.isStoped = function() {
      return me._state === Reqbert.GameState.stoped;
    };

    me.isRunning = function() {
      return me._state === Reqbert.GameState.running;
    };

    me.isPaused = function() {
      return me._state === Reqbert.GameState.paused;
    };

    me._init();
    return me;
  };

  Reqbert.GameState = {
    stoped: 0,
    running: 1,
    paused: 2
  };

  if(!window.Reqbert)
    window.Reqbert = Reqbert;
})();