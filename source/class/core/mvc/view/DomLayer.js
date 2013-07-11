/* 
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function() 
{
  var hasPerspective = !!core.bom.Style.property("perspective");

  var buildTranslate = function(x, y, z)
  {
    if (x == null) {
      x = 0;
    }

    if (y == null) {
      y = 0;
    }

    if (z == null) {
      z = 0;
    }

    if (hasPerspective) {
      return "translate3d(" + x + "," + y + "," + z + ")";
    } else {
      return "translateX(" + x + ") translateY(" + y + ")";
    }
  };

  var outLeft = buildTranslate("-100%");
  var outRight = buildTranslate("100%");
  

  /**
   * Animatable DOM Layer View
   *
   */
  core.Class("core.mvc.view.DomLayer",
  {
    include : [core.mvc.view.Dom],

    construct : function(presenter, root) {
      core.mvc.view.Dom.call(this, presenter, root);
    },

    members :
    {
      // Interface implementation
      show : function(approach)
      {
        var elem = this.getRoot();
        if (!elem) {
          return;
        }

        if (approach == null || approach == "jump")
        {
          elem.style.display = "block";
          this.fireEvent("show");
        }
        else
        {
          if (approach == "in")
          {
            var from = { transform : outRight };
            var to = { transform : "" };
          }
          else if (approach == "out")
          {
            var from = { transform : outLeft };
            var to = { transform : "" };
          }
          else if (jasy.Env.isSet("debug"))
          {
            throw new Error("Unsupported approach to show layer: " + approach + "!");
          }

          core.bom.Transition.fadeIn(elem, from, to, function() {
            this.fireEvent("show");
          }, this);
        }
      },


      // Interface implementation
      hide : function(approach)
      {
        var elem = this.getRoot();
        if (!elem) {
          return;
        }

        if (approach == null || approach == "jump")
        {
          elem.style.display = "none";
          this.fireEvent("hide");
        }
        else
        {
          if (approach == "in")
          {
            var to = { transform: outLeft };
            var reset = { transform: "" };
          }
          else if (approach == "out")
          {
            var to = { transform: outRight };
            var reset = { transform: "" };
          }
          else if (jasy.Env.isSet("debug"))
          {
            throw new Error("Unsupported approach to show layer: " + approach + "!");
          }

          core.bom.Transition.fadeOut(elem, to, reset, function() {
            this.fireEvent("hide");
          }, this);
        }
      }
    }
  });

})();
  