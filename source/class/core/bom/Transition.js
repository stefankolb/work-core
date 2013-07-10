(function() 
{
  var name = "transitionend";

  if (jasy.Env.isSet("engine", "webkit")) {
    name = "webkitTransitionEnd";
  }

  core.Module("core.bom.Transition",
  {
    addListener : function(elem, callback, context)
    {
      if (context) {
        callback = core.Function.bind(callback, context);
      }

      elem.addEventListener(name, callback, false);
    },

    removeListener : function(elem, callback, context)
    {
      if (context) {
        callback = core.Function.bind(callback, context);
      }

      elem.removeEventListener(name, callback, false);      
    }
  });
})();
