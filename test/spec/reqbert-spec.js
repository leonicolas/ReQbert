describe('Reqbert', function() {
  var reqbert;

  beforeEach(function() {
    var containerId = 'game-container';
    createGameContainer(containerId);    
    reqbert = new Reqbert(containerId);
  });

  describe('When a new game is created', function() {
    it('it should not be null', function() {
      expect(reqbert).not.toBeNull();
    });

    it('it should be in stoped state', function() {
      expect(reqbert.isStoped()).toBeTruthy();
    });

    it('it should not be in running state', function() {
      expect(reqbert.isRunning()).toBeFalsy();
    });

    it('it should not be in paused state', function() {
      expect(reqbert.isPaused()).toBeFalsy();
    });
  });

  describe('When start the game', function() {
    beforeEach(function() {
      reqbert.start();
    });

    it('it should be in running state', function() {
      expect(reqbert.isRunning()).toBeTruthy();
    });

    it('it should not be in stoped state', function() {
      expect(reqbert.isStoped()).toBeFalsy();
    });

    it('it should not be in paused state', function() {
      expect(reqbert.isPaused()).toBeFalsy();
    });    
  });
});