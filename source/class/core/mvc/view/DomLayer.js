/**
 * Animatable DOM Layer View
 *
 */
core.Class("core.mvc.view.DomLayer",
{
  include : [core.mvc.view.Dom],

  construct : function(presenter, root)
  {
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
        this.log("Show: Approach: " + approach)

        if (approach == "in")
        {
          var fromTransform = "translateX(100%)";
          var toTransform = "";
        }
        else if (approach == "out")
        {
          var fromTransform = "translateX(-100%)";
          var toTransform = "";
        }

        // Show element and render off screen
        core.bom.Style.set(elem, "transitionDuration", "0ms");
        core.bom.Style.set(elem, "transform", fromTransform);
        core.bom.Style.set(elem, "display", "block");

        // Enforce rendering
        elem.offsetWidth;

        // Post-pone visible animation to next render frame
        core.effect.AnimationFrame.request(function()
        {
          core.bom.Style.set(elem, "transitionDuration", "");
          core.bom.Style.set(elem, "transform", toTransform);
        });

        // Connect to end event
        core.bom.Transition.addListener(elem, this.__onTransitionEndShow, this);
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
        this.fireEvent("show");
      }
      else
      {
        this.log("Hide: Approach: " + approach)

        if (approach == "in")
        {
          var fromTransform = "";
          var toTransform = "translateX(-100%)";
        }
        else if (approach == "out")
        {
          var fromTransform = "";
          var toTransform = "translateX(100%)";
        }

        // Move element to origin position
        core.bom.Style.set(elem, "transitionDuration", "0ms");
        core.bom.Style.set(elem, "transform", fromTransform);

        // Post-pone visible animation to next render frame
        core.effect.AnimationFrame.request(function()
        {
          core.bom.Style.set(elem, "transitionDuration", "");
          core.bom.Style.set(elem, "transform", toTransform);
        });

        // Connect to end event
        core.bom.Transition.addListener(elem, this.__onTransitionEndHide, this);
      }
    },



    __onTransitionEndShow : function() 
    {
      this.fireEvent("show");

      core.bom.Transition.removeListener(this.getRoot(), this.__onTransitionEndShow, this);
    },

    __onTransitionEndHide : function() 
    {
      this.getRoot().style.display = "none";
      this.fireEvent("hide");

      core.bom.Transition.removeListener(this.getRoot(), this.__onTransitionEndHide, this);
    }


  }

})