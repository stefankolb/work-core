/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Abstract presenter class with support for managing:
 *
 * - Children (Child Presenters)
 * - Models (Models and Collections)
 * - Views (Views for Output)
 */
core.Class("core.mvc.presenter.Abstract",
{
  include: [core.property.MGeneric, core.event.MEventTarget, core.util.MLogging],

  /**
   * @parent {core.mvc.presenter.Abstract} Parent presenter to attach to this presenter
   */
  construct : function(parent) 
  {
    // Keep reference to parent presenter
    if (parent != null) {
      this.__parent = parent;  
    }

    // Child presenters and views
    this.__children = {};
    this.__models = {};
    this.__views = {};
  },

  members :
  {
    /*
    ======================================================
      PARENT CONNECTION
    ======================================================
    */

    __parent : null,
    

    /**
     * {core.mvc.presenter.Abstract} Returns the parent presenter.
     */
    getParent : function() {
      return this.__parent;
    },


    /**
     * Sets the @parent {core.mvc.presenter.Abstract} presenter.
     */
    setParent : function(parent) {
      this.__parent = parent;
    },    


    /**
     * {core.mvc.presenter.Abstract} Returns the event parent - which is our parent presenter.
     */
    getEventParent : function() {
      return this.__parent;
    },



    /*
    ======================================================
      MODEL MANAGMENT
    ======================================================
    */

    /** 
     * {Object} Returns a model by its @name {String}. 
     */
    getModel : function(name) 
    {
      if (jasy.Env.isSet("debug")) {
        core.Assert.isType(name, "String", "Invalid model name!");
      }

      return this.__models[name];
    },


    /**
     * {this} Adds a @model {Object} by its @name {String}.
     */
    addModel : function(name, model) 
    {
      var db = this.__models;

      if (jasy.Env.isSet("debug")) 
      {
        if (name in db) {
          throw new Error("Model name " + name + " is already in use!");  
        }
        
        core.Assert.isType(model, "Object", "Invalid model instance!");
      }

      db[name] = model;
      return this;
    },


    /**
     * {Object} Removes the given model by its @name {String}. 
     * Returns the removed model.
     */
    removeModelByName : function(name) 
    {
      var db = this.__models;
      var model = db[name];
      if (model)
      {
        delete db[name];
        return model;
      }
    },


    /**
     * {Boolean} Removes the given @model {Object} and returns whether it succeeded.
     */
    removeModel : function(model) 
    {
      var db = this.__models;
      for (var name in db) 
      {
        if (db[name] === model) 
        {
          delete db[name];
          return true;
        }
      }

      return false;
    },


    /**
     * {Object} Creates and registers a model under the given @name {String}
     * using the given model @construct {Class}. Supports optional arguments
     * using @varargs {any...} which are passed to the constructor. Returns the
     * model instance which was created.
     */
    createModel : function(name, construct, varargs) 
    {
      var args = arguments;

      if (args.length > 2)
      {
        if (args.length == 3) {
          var model = new construct(args[2]);
        } else if (args.length == 4) {
          var model = new construct(args[2], args[3]);
        } else if (args.length == 5) {
          var model = new construct(args[2], args[3], args[4]);
        } else if (jasy.Env.isSet("debug")) {
          throw new Error("Too many arguments!");
        }
      }
      else
      {
        var model = new construct();
      }
      
      return this.addModel(name, model);
    },





    /*
    ======================================================
      VIEW MANAGMENT
    ======================================================
    */

    /** 
     * {Object} Returns a view by its @name {String}. 
     */
    getView : function(name) 
    {
      if (jasy.Env.isSet("debug")) {
        core.Assert.isType(name, "String", "Invalid view name!");
      }

      return this.__views[name];
    },


    /**
     * Adds a @view {Object} by its @name {String}.
     */
    addView : function(name, view) 
    {
      var db = this.__views;

      if (jasy.Env.isSet("debug")) 
      {
        if (name in db) {
          throw new Error("View name " + name + " is already in use!");  
        }

        core.Assert.isType(view, "Object", "Invalid view instance!");
      }

      db[name] = view;
      return view;
    },


    /**
     * {Object} Removes the given view by its @name {String}. 
     * Returns the removed view.
     */
    removeViewByName : function(name) 
    {
      var db = this.__views;
      var view = db[name];
      if (view)
      {
        delete db[name];
        return view;
      }
    },


    /**
     * {Boolean} Removes the given @view {Object} and returns whether it succeeded.
     */
    removeView : function(view) 
    {
      var db = this.__views;
      for (var name in db) 
      {
        if (db[name] === view) 
        {
          delete db[name];
          return true;
        }
      }

      return false;
    },


    /**
     * {Object} Creates and registers a view under the given @name {String}
     * using the given view @construct {Class}. Supports optional arguments
     * using @varargs {any...} which are passed to the constructor. Returns the
     * view instance which was created.
     */
    createView : function(name, construct, varargs) 
    {
      var args = arguments;

      if (args.length > 2)
      {
        if (args.length == 3) {
          var view = new construct(this, args[2]);
        } else if (args.length == 4) {
          var view = new construct(this, args[2], args[3]);
        } else if (args.length == 5) {
          var view = new construct(this, args[2], args[3], args[4]);
        } else if (jasy.Env.isSet("debug")) {
          throw new Error("Too many arguments!");
        }
      }
      else
      {
        var view = new construct(this);
      }
      
      return this.addView(name, view);
    },




    /*
    ======================================================
      CHILD PRESENTER MANAGMENT
    ======================================================
    */

    /**
     * Returns a child presenter by its @name {String}.
     */
    getChild : function(name) 
    {
      if (jasy.Env.isSet("debug")) {
        core.Assert.isType(name, "String", "Invalid child name!");
      }

      return this.__children[name];
    },


    /**
     * Adds the given @presenter {Object} instance to the child registry 
     * by the given @name {String}.
     */
    addChild : function(name, presenter) 
    {
      var db = this.__children;

      if (jasy.Env.isSet("debug")) 
      {
        if (name in db) {
          throw new Error("Child name " + name + " is already in use!");  
        }
        
        core.Assert.isType(presenter, "Object", "Invalid presenter instance!");
      }

      db[name] = presenter;
      return presenter;
    },


    /**
     * {Boolean} Removes the given child by its @name {String}. Returns whether it succeeded.
     */
    removeChildByName : function(name) {
      return delete this.__children[name];
    },


    /**
     * {Boolean} Removes the given @child {Object}. Returns whether it succeeded.
     */
    removeChild : function(child) 
    {
      var db = this.__children;
      for (var name in db) 
      {
        if (db[name] === child) {
          return delete db[name];
        }
      }

      return false;
    },


    /**
     * {Object} Creates and registers a child presenter under the given @name {String}
     * using the given presenter @construct {Class}. Supports optional arguments
     * using @varargs {var...} which are passed to the constructor. Returns the
     * presenter instance which was created.
     */
    createChild : function(name, construct, varargs) 
    {
      var args = arguments;

      if (args.length > 2)
      {
        if (args.length == 3) {
          var child = new construct(this, args[2]);
        } else if (args.length == 4) {
          var child = new construct(this, args[2], args[3]);
        } else if (args.length == 5) {
          var child = new construct(this, args[2], args[3], args[4]);
        } else if (jasy.Env.isSet("debug")) {
          throw new Error("Too many arguments!");
        }
      }
      else
      {
        var child = new construct(this);
      }
      
      return this.addChild(name, child);
    }
  }
});
