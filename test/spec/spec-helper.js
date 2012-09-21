beforeEach(function() {
  this.addMatchers({
  });
});

function createGameContainer(id) {
    var container = document.createElement('div');
    container.setAttribute('id', id);
    container.style.display = 'none';
    document.body.appendChild(container);
    return container;  
}
