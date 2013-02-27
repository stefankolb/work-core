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

    // Child presenters
    this.__children = {};
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
      CHILDREN MANAGMENT
    ======================================================
    */

    getChild : function(name) {
      return this.__children[name];
    },

    addChild : function(name, presenter) 
    {
      var db = this.__children;

      if (jasy.Env.isSet("debug")) 
      {
        if (name in db) {
          throw new Error("Child name " + name + " is already in use!");  
        }
        
        if (!core.Main.isType(presenter, "Object")) {
          throw new Error("Invalid presenter instance: " + presenter);
        }
      }

      db[name] = presenter;
      return presenter;
    },


    /**
     * {Boolean} Removes the given child by its @name {String}. Returns whether it succeeded.
     */
    removeChild : function(name) {
      return delete this.__children[name];
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
