describe('FrameTimer', function() {
  var frameTimer;

  beforeEach(function() {
    frameTimer = new Game.FrameTimer();
  });

  describe('When is ticked ten times in a second', function() {
    var MAX_TICKS = 10;

    it('the FPS should be near to ten and the frame duration time should be near to 0.1 seconds', function() {
      var ticks = 0;
      waitsFor(function() {
        return ticks === MAX_TICKS;
      }, "Ten ticks never completed", 1000);

      var interval = setInterval(function() {
        frameTimer.tick();
        ticks++;
        if(ticks > 1) {
          expect(frameTimer.getFrameDurationTimeInSeconds()).toBeCloseTo(0.10, 2);
        }
        if(ticks >= MAX_TICKS)
          clearInterval(interval);
      }, 1000 / MAX_TICKS);

      runs(function () {
        expect(Math.round(frameTimer.getFPS())).toEqual(MAX_TICKS);
      });
    });
  });
});