/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

/**
 * Basic interface any event class needs to implement.
 */
core.Interface("core.event.IEvent",
{
  members : 
  {
    /** 
     * {String} Returns the type of the event.
     */
    getType : function() {},

    /**
     * {Object} Returns the target on which the event is fired.
     */
    //getTarget : function() {},

    /**
     * Sets the given @target {Object} during dispatching of the event object.
     */
    //setTarget : function(target) {}
  }
});
