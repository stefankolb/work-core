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
          var from = { transform : "translateX(100%)" };
          var to = { transform : "" };
        }
        else if (approach == "out")
        {
          var from = { transform : "translateX(-100%)" };
          var to = { transform : "" };
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
        this.fireEvent("show");
      }
      else
      {
        this.log("Hide: Approach: " + approach)

        if (approach == "in")
        {
          var from = { transform: "" };
          var to = { transform: "translateX(-100%)" };
        }
        else if (approach == "out")
        {
          var from = { transform: "" };
          var to = { transform: "translateX(100%)" };
        }

        core.bom.Transition.fadeOut(elem, from, to, function() {
          this.fireEvent("hide");
        }, this);
      }
    }
  }
})