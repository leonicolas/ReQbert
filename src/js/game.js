var Game = Game || {};
var Debug;

(function() {
  /* FRAME TIMER */
  Game.FrameTimer = function() {
    this.frameDurationTime = new Date().getTime();
  };
  Game.FrameTimer.prototype.constructor = Game.FrameTimer;

  Game.FrameTimer.prototype.getFrameDurationTimeInSeconds = function getFrameDurationTimeInSeconds() {
    var seconds = this.frameDurationTime / 1000;
    return isNaN(seconds) ? 0 : seconds;
  };
 
  Game.FrameTimer.prototype.tick = function tick() {
    var currentTickTime = new Date().getTime();
    this.frameDurationTime = currentTickTime - this.lastTickTime;
    this.lastTickTime = currentTickTime;
  };

  Game.FrameTimer.prototype.getFPS = function getFPS() {
    return 1000 / this.frameDurationTime;
  };
})();

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
// see https://gist.github.com/1579671
(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());