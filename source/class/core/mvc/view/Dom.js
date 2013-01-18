/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

core.Class("core.mvc.view.Dom",
{
  include : [core.mvc.view.Abstract],

  construct: function(presenter) 
  {
    core.mvc.view.Abstract.call(this, presenter);


  },

  properties : 
  {
    /** The root element to render into */
    root : 
    {
      type: "Node",
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
      if (!elem) {
        return;
      }

      var template = this.getTemplate();
      if (!template) {
        return;
      }

      // Allow both MVP and MVC approaches
      var presenterOrModel = this.getPresenter() || this.getModel();

      this.log("Rendering with:", presenterOrModel);
      elem.innerHTML = template.render(presenterOrModel);

      return this;
    }    
  }

});
