describe('Scene', function() {
  var scene;
  beforeEach(function() {
    var containerId = 'game-container';
    var container = createGameContainer(containerId);
    scene = new Scene(containerId);
  });

  describe('When a new Scene is created', function() {
    it('should not be null', function() {
      expect(scene).not.toBe(null);
    });
  });
});