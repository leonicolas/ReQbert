(function() {
  var doc = document;
  var Scene, Debug;

  Scene = function (containerId) {
    var me = this;

    me.config = new Scene.Config(containerId);

    me.init = function() {
    };

    me.init();
    return me;
  };

  Scene.Config = function(containerId) {
    var me = this;

    /** MSX default resolution **/
    me.width = 256;
    me.height = 192;
    me.container = null;
    me.useRAF = false;

    me.init = function() {
      me.initContainer();
      me.initRAF();
      me.initSize();
      debug.log('Scene init!', me);
    };

    me.initRAF = function() {
      me.useRAF = window.requestAnimationFrame || 
                  window.webkitRequestAnimationFrame || 
                  window.mozRequestAnimationFrame || 
                  window.oRequestAnimationFrame || 
                  window.msRequestAnimationFrame;
    };

    me.initContainer = function() {
      if(containerId)
        me.container = doc.getElementById(containerId);
      if(!me.container)
        throw "Invalid container id";
    };

    me.initSize = function() {
      var w = me.container.offsetWidth;
      var h = me.container.offsetHeight;
      if(w)
        me.width = w;
      if(h)
        me.height = h;
    };

    me.init();
    return me;
  };

  Debug = function() {
    var me = this;
    
    me.customConsole = null;

    me.init = function() {
      if(!console || !console.log)
        me.createCustomConsole();
    };

    me.createCustomConsole = function () {
      me.customConsole = document.createElement('div');
      me.customConsole.setAttribute('id', 'custom-console');
      document.body.appendChild(me.customConsole);
    }

    me.log = function() {
      if(!arguments.size === 0)
        return;
      if(me.customConsole)
        me.logOnCustomConsole.apply(this, arguments);
      else
        console.log(arguments);
    };

    me.logOnCustomConsole = function(args) {
        // TODO Add new types
        if(args instanceof Array)
          for(var arg in args)
            me.appendMessage(arg);
        else
            me.appendMessage(args);
    }

    me.appendMessage = function(msg) {
      me.customConsole.innerHTML += msg + '<br/>';
    };

    me.init();
    return me;
  };

  if(!window.Scene)
    window.Scene = Scene;

  if(!window.Debug)
    window.debug = new Debug();
})();