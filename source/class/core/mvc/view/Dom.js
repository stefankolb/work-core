/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

core.Class("core.mvc.view.Dom",
{
  include : [core.mvc.view.Abstract],
  implement : [core.mvc.view.IView],

  construct: function(presenter, root)
  {
    core.mvc.view.Abstract.call(this, presenter);

    this.__subViews = {};

    if (root != null) 
    {
      if (jasy.Env.isSet("debug")) {
        core.Assert.isType(root, "Node", "Invalid root node!");  
      }
      
      this.setRoot(root);
    }
  },

  properties : 
  {
    /** Instance of compiled template to produce final data / text for output e.g. HTML, JSON, ... */
    template : 
    {
      type: core.template.Template,
      nullable : true,
      apply : function() {
        this.render();
      }
    },

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

  events :
  {
    render : core.event.Simple

  },

  members : 
  {
    // Interface implementation
    render : function()
    {
      if (this.__renderScheduled != null) {
        return;
      }

      /** #require(ext.RequestAnimationFrame) */
      this.__renderScheduled = requestAnimationFrame(core.util.Function.bind(this.__renderRequest, this));
    },



    addSubView : function(name, view) 
    {
      this.__subViews[name] = view;
      this.__partials = null;

      this.render();
    },

    removeSubView : function(name) 
    {
      delete this.__subViews[name];
      this.__partials = null;

      this.render();
    },


    __renderRequest : function()
    {
      if (this._shouldRender()) 
      {
        this.__render();
        this.__renderScheduled = null;
      }
      else
      {
        this.__renderScheduled = requestAnimationFrame(core.util.Function.bind(this.__renderRequest, this));
      }
    },


    /**
     * Internal render method which is called in buffered mode
     * so that only one rendering happens per frame.
     */
    __render : function()
    {
      var presenter = this.getPresenter();
      if (!presenter) {
        return;
      }

      var elem = this.getRoot();
      if (!elem) {
        return;
      }

      var template = this.getTemplate();
      if (!template) {
        return;
      }

      var partials = this.__partials;
      if (partials == null)
      {
        this.__partials = partials = {};

        var subViews = this.__subViews;
        for (var name in subViews) {
          partials[name] = subViews[name].getTemplate();
        }
      }

      if (!this.__resolver)
      {
        var self = this;
        var helper = new Function();
        helper.prototype = this;
        helper.prototype.getLabel = function(name) {
          return self.getLabel(name);
        };

        this.__resolver = new helper;
      };



      this._beforeRender();
      elem.innerHTML = template.render(this.__resolver, partials);
      this._afterRender();

      // Let others know
      this.fireEvent("render");
    },


    _shouldRender : function() {
      return this.__isLoading == 0;
    },


    _beforeRender : function() {
      // placeholder
    },


    _afterRender : function() {
      // placeholder
    },


    // Interface implementation
    show : function()
    {
      var elem = this.getRoot();
      if (!elem) {
        return;
      }

      elem.style.display = "";
      this.fireEvent("show");
    },


    // Interface implementation
    hide : function()
    {
      var elem = this.getRoot();
      if (!elem) {
        return;
      }

      elem.style.display = "none";
      this.fireEvent("hide");
    },


    __isLoading : 0,


    /**
     * Loads the given @tmpl {Uri} via the text loader (XHR) and creates
     * a new template instance which is auto applied to the #text property afterwards.
     */
    loadTemplate : function(tmpl, nocache)
    {
      this.__isLoading++;
      core.io.Text.load(jasy.Asset.toUri(tmpl), this.__loadTemplateCallback, this, nocache);      
    },


    __loadTemplateCallback : function(uri, errornous, data) 
    {
      this.__isLoading--;

      if (errornous) {
        throw new Error("Could not load template: " + uri + "!");
      }

      // Enable stripping (to remove white spaces from formatting)
      this.setTemplate(core.template.Compiler.compile(data.text, true));  
    },

    loadStyleSheet : function(sheet, nocache)
    {
      this.__isLoading++;
      core.io.StyleSheet.load(jasy.Asset.toUri(sheet), this.__loadStyleSheetCallback, this, nocache);
    },

    __loadStyleSheetCallback : function(uri, errornous) 
    {
      this.__isLoading--;

      if (errornous) {
        throw new Error("Could not load style sheet: " + uri + "!");
      }
    }
  }
});
