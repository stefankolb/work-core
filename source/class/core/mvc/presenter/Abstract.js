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
      
      if (jasy.Env.isSet("debug") && name in db) {
        throw new Error("Child name " + name + " is already in use!");
      }

      db[name] = presenter;
      return presenter;
    },

    removeChild : function(name) {
      return delete this.__children[name];
    },

    createChild : function(name, construct) 
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
