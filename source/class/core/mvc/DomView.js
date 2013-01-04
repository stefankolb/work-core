/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

core.Class("core.mvc.DomView",
{
  include : [core.mvc.View],

  construct: function(properties, events) 
  {
    core.mvc.View.call(this, properties);

    for (var key in events) {


    }
  },


  properties : 
  {
    /** The root element to render into */
    root : 
    {
      type: "Element",
      nullable : true,
      apply : function(value, old) {
        this.render();
      }
    }

  },


  members : 
  {
    // Definition of abstract method
    render : function() 
    {
      var elem = this.getRoot();
      if (!elem)
      {
        var id = this.getId();
        if (jasy.Env.isSet("debug")) 
        {
          if (!id) {
            throw new Error("Please define either an element or an ID for having a valid render target.");
          }
        }

        this.setRoot(document.getElementById(id));

        // Setting the root leads to another render() call
        return;
      }

      var template = this.getTemplate();
      if (!template) {
        return;
      }

      var data = this.getModel();
      elem.innerHTML = template.render(data ? data.toJSON() : {});

      return this;
    }    
  }

});
