/* 
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

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
          var from = { transform : "translateX(100%)" };
          var to = { transform : "" };
        }
        else if (approach == "out")
        {
          var from = { transform : "translateX(-100%)" };
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
          var to = { transform: "translateX(-100%)" };
          var reset = { transform: "" };
        }
        else if (approach == "out")
        {
          var to = { transform: "translateX(100%)" };
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

