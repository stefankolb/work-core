/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

core.Class("core.mvc.view.Dom",
{
  include : [core.mvc.view.Abstract],

  construct: function(presenter) {
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
    /** #require(ext.sugar.Function) */
    render : (function()
    {
      var elem = this.getRoot();
      if (!elem) {
        return;
      }

      var template = this.getTemplate();
      if (!template) {
        return;
      }

      var presenter = this.getPresenter() || {};
      if (this.getPresenter() == null) {
        this.warn("Missing presenter!");
      }

      this.log("Rendering view...");
      elem.innerHTML = template.render(presenter);
      return this;      
    }).debounce(10),

    show : function()
    {
      var elem = this.getRoot();
      if (!elem) {
        return;
      }

      elem.style.display = "";
      this.fireEvent("show");
    },

    hide : function()
    {
      var elem = this.getRoot();
      if (!elem) {
        return;
      }

      elem.style.display = "none";
      this.fireEvent("hide");
    } 
  }

});
