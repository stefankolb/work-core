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
  },

  members :
  {
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
    }
  }
});
