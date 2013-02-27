/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
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
     * {core.mvc.presenter.Abstract} Returns the parent presenter.
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
      VIEW MANAGMENT
    ======================================================
    */

    getView : function(name) {
      return this.__views[name];
    },

    addView : function(name, view) 
    {
      var db = this.__views;

      if (jasy.Env.isSet("debug")) 
      {
        if (name in db) {
          throw new Error("View name " + name + " is already in use!");  
        }
        
        if (!core.Main.isTypeOf(view, "Object")) {
          throw new Error("Invalid view instance: " + view);
        }
      }

      db[name] = view;
      return view;
    },


    /**
     * {Boolean} Removes the given child by its @name {String}. Returns whether it succeeded.
     */
    removeViewByName : function(name) {
      return delete this.__views[name];
    },


    /**
     * {Boolean} Removes the given @child {Object}. Returns whether it succeeded.
     */
    removeView : function(child) 
    {
      var db = this.__views;
      for (var name in db) 
      {
        if (db[name] === child) {
          return delete db[name];
        }
      }

      return false;
    },


    /**
     * {Object} Creates and registers a view under the given @name {String}
     * using the given view @construct {Class}. Supports optional arguments
     * using @varargs {var...} which are passed to the constructor. Returns the
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
      CHILDREN MANAGMENT
    ======================================================
    */

    /**
     * Returns a child presenter by its @name {String}.
     */
    getChild : function(name) {
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
        
        if (!core.Main.isTypeOf(presenter, "Object")) {
          throw new Error("Invalid presenter instance: " + presenter);
        }
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
