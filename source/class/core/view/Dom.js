/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Base class for a DOM based view. Uses debounced rendering using RequestAnimationFrame
 * for optimal performance. Supports easy DOM event managment for view content.
 */
core.Class("core.view.Dom",
{
  include : [core.view.Abstract],
  implement : [core.view.IView],

  construct: function(presenter, root)
  {
    core.view.Abstract.call(this, presenter);

    this.__renderRequestBound = core.Function.bind(this.__renderRequest, this);

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
    /** Fired whenever the view has been rendered */
    render : core.event.Simple

  },

  members : 
  {
    /*
    ======================================================
      DEBOUNCED RENDER LOGIC
    ======================================================
    */

    // Interface implementation
    render : function()
    {
      if (this.__renderScheduled != null) {
        return;
      }

      this.__renderScheduled = core.effect.AnimationFrame.request(this.__renderRequestBound);
    },


    /**
     * This method checks for whether all required data is available and triggers
     * the rendering as soon as this happens. Until than it regularly re-evaluates 
     * whether this case happens.
     */
    __renderRequest : function()
    {
      if (this.__loaded && this._shouldRender()) 
      {
        this.__render();
        this.__renderScheduled = null;
      }
      else
      {
        this.__renderScheduled = core.effect.AnimationFrame.request(this.__renderRequestBound);
      }
    },


    /**
     * Internal render method which is called in buffered mode
     * so that only one rendering happens per frame.
     */
    __render : function()
    {
      var presenter = this.getPresenter();
      var elem = this.getRoot();
      var template = this.getTemplate();

      if (!presenter || !elem || !template) {
        return;
      }

      var partials = this.getPartials();
      var labels = this.getLabels();

      this._beforeRender();
      elem.innerHTML = template.render(presenter, partials, labels);
      this._afterRender();

      // Let others know
      this.fireEvent("render");
    },


    _beforeRender : function() {
      // placeholder
    },


    _afterRender : function() {
      // placeholder
    },


    _shouldRender : function() {
      return true;
    },


    __loaded : false,

    markAsLoaded : function() 
    {
      this.log("All assets loaded!");
      this.__loaded = true;
      this.render();
    },

    markAsFailed : function() {
      this.error("Unable to load required assets. Please retry!");
    },



    /*
    ======================================================
      PUBLIC API
    ======================================================
    */

    // Interface implementation
    show : function(approach)
    {
      var elem = this.getRoot();
      if (!elem) {
        return;
      }

      elem.style.display = "block";
      this.fireEvent("show");
    },


    // Interface implementation
    hide : function(approach)
    {
      var elem = this.getRoot();
      if (!elem) {
        return;
      }

      elem.style.display = "none";
      this.fireEvent("hide");
    },


    /**
     * {Object} Returns the event parent which is used to bubble view events, to
     */
    getEventParent : function() {
      return this.getPresenter();
    },



    /*
    ======================================================
      REMOTE ASSET LOADING
    ======================================================
    */

    /**
     * {core.event.Promise} Loads and registers the given partial from 
     * a local @assetId {String}. Returns a promise for easy management.
     * 
     * The name of the partial is auto extracted as the file name part
     * of the @assetId.
     */
    loadPartial : function(assetId)
    {
      var promise = core.event.Promise.obtain();

      // Auto extract partial name from file name
      // Convention over configuration FTW
      var lastSlash = assetId.lastIndexOf("/");
      var lastDot = assetId.lastIndexOf(".");
      var name = assetId.slice(lastSlash+1, lastDot);

      core.io.Text.load(jasy.Asset.toUri(assetId), function(uri, errornous, data) 
      {
        if (jasy.Env.isSet("debug")) 
        {
          if (errornous) {
            this.error("Failed to load partial: " + uri);
          } else {
            this.log("Loaded partial: " + uri);
          }
        }

        // Enable stripping (to remove white spaces from formatting)
        var template = core.template.Compiler.compile(data.text, this.getLabels());
        this.addPartial(name, template);

        errornous ? promise.reject("io") : promise.fulfill(data);
        promise.release();
      }, this);

      return promise;
    },


    /**
     * {core.event.Promise} Loads and registers the given template from 
     * a local @assetId {String}. Returns a promise for easy management.
     */
    loadTemplate : function(assetId)
    {
      var promise = core.event.Promise.obtain();

      core.io.Text.load(jasy.Asset.toUri(assetId), function(uri, errornous, data) 
      {
        if (jasy.Env.isSet("debug")) 
        {
          if (errornous) {
            this.error("Failed to load template: " + uri);
          } else {
            this.log("Loaded template: " + uri);
          }
        }

        // Enable stripping (to remove white spaces from formatting)
        var template = core.template.Compiler.compile(data.text, this.getLabels());
        this.setTemplate(template);  

        errornous ? promise.reject("io") : promise.fulfill(data);
        promise.release();
      }, this);

      return promise;
    },


    /**
     * {core.event.Promise} Loads and injects the given stylesheet from 
     * a local @assetId {String}. Returns a promise for easy management.
     */
    loadStyleSheet : function(assetId)
    {
      var promise = core.event.Promise.obtain();

      core.io.StyleSheet.load(jasy.Asset.toUri(assetId), function(uri, errornous, data) 
      {
        if (jasy.Env.isSet("debug")) 
        {
          if (errornous) {
            this.error("Failed to load stylesheet: " + uri);
          } else {
            this.log("Loaded stylesheet: " + uri);
          }
        }

        errornous ? promise.reject("io") : promise.fulfill(data);
        promise.release();
      }, this);

      return promise;
    }
  }
});
