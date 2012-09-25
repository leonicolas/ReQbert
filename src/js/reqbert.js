(function() {
  var Reqbert;

  Reqbert = function (containerId) {
    this.state = Reqbert.GameState.STOPPED;
    return this;
  }

  Reqbert.prototype.start = function() {
    debug.log('Starting Reqbert!');
    this.state = Reqbert.GameState.RUNNING;
    return this;
  };

  Reqbert.prototype.isStopped = function() {
    return this.state === Reqbert.GameState.STOPPED;
  };

  Reqbert.prototype.isRunning = function() {
    return this.state === Reqbert.GameState.RUNNING;
  };

  Reqbert.prototype.isPaused = function() {
    return this.state === Reqbert.GameState.PAUSED;
  };

  Reqbert.GameState = {
    STOPPED: 'stopped',
    RUNNING: 'running',
    PAUSED: 'paused'
  };

  if(!window.Reqbert)
    window.Reqbert = Reqbert;
})();