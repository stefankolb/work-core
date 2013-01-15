(function()
{
  var console = core.Main.getGlobal().console;
  var slice = Array.prototype.slice;

  var print = function(method, obj, args) 
  {
    var extended = slice.call(args);
    extended.push(obj.toString());
    console[method].apply(console, args)
  };

  core.Class("core.util.MLogging",
  {
    members :
    {
      log : function() {
        print(this, "log", arguments);
      },

      debug : function() {
        print(this, "log", arguments);
      },

      warn : function() {
        print(this, "warn", arguments);
      },

      error : function() {
        print(this, "error", arguments);
      },

      info : function() {
        print(this, "info", arguments);
      }
    }
  });
})();
