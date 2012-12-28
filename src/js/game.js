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
