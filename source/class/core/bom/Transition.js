(function() 
{
  var name = "transitionend";

  if (jasy.Env.isSet("engine", "webkit")) {
    name = "webkitTransitionEnd";
  }

  var addListener = function(elem, callback, context)
  {
    if (context) {
      callback = core.Function.bind(callback, context);
    }

    elem.addEventListener(name, callback, false);
  };

  var removeListener = function(elem, callback, context)
  {
    if (context) {
      callback = core.Function.bind(callback, context);
    }

    elem.removeEventListener(name, callback, false);      
  };

  core.Module("core.bom.Transition",
  {
    addListener : addListener,
    removeListener : removeListener,

    fadeIn : function(elem, from, to, callback, context)
    {
      if (from != null)
      {
        // Show element and render off screen
        core.bom.Style.set(elem, "transitionDuration", "0ms");
        core.bom.Style.set(elem, from);
      }

      // Show element and enforce rendering
      elem.style.display = "block";
      elem.offsetWidth;

      // Post-pone visible animation to next render frame
      core.effect.AnimationFrame.request(function()
      {
        core.bom.Style.set(elem, "transitionDuration", "");
        core.bom.Style.set(elem, to);
      });

      // Connect to transition end event
      var helper = function() 
      {
        removeListener(elem, helper);
        context ? callback.call(context) : callback();
      };

      addListener(elem, helper);
    },

    fadeOut : function(elem, from, to, callback, context)
    {
      if (from != null)
      {
        // Move element to origin position
        core.bom.Style.set(elem, "transitionDuration", "0ms");
        core.bom.Style.set(elem, from);
      }

      // Post-pone visible animation to next render frame
      core.effect.AnimationFrame.request(function()
      {
        core.bom.Style.set(elem, "transitionDuration", "");
        core.bom.Style.set(elem, to);
      });

      // Connect to transition end event
      var helper = function() 
      {
        removeListener(elem, helper);
        elem.style.display = "none";

        context ? callback.call(context) : callback();
      };

      addListener(elem, helper);     
    }
  });
})();
