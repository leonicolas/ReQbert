(function() {
  var doc = document;
  
  var Debug = function() {
    this.customConsole = null;
    this.init();
  }

  Debug.prototype.init = function() {
    if(!console || !console.log)
      this.createCustomConsole();
  };

  Debug.prototype.createCustomConsole = function () {
    this.customConsole = document.createElement('div');
    this.customConsole.setAttribute('id', 'custom-console');
    document.body.appendChild(this.customConsole);
  }

  Debug.prototype.log = function() {
    if(!arguments.size === 0)
      return;
    if(this.customConsole)
      this.logOnCustomConsole.apply(this, arguments);
    else
      console.log(arguments);
    return this;
  };

  Debug.prototype.logOnCustomConsole = function(args) {
    // TODO Add new types
    if(args instanceof Array)
      for(var arg in args)
        this.appendMessage(arg);
    else
        this.appendMessage(args);
  }

  Debug.prototype.appendMessage = function(msg) {
    this.customConsole.innerHTML += msg + '<br/>';
  };

  if(!window.Debug)
    window.debug = new Debug();
})();