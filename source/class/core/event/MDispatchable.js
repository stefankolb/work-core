/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

/**
 * Basic event class adding support for setTarget/getTarget which is used during
 * event dispatching by {core.event.MEventTarget}.
 */
core.Class("core.event.MDispatchable",
{
  members :
  {
    __target : null,
    __currentTarget : null,
    __propagationStopped : false,
    __eventPhase : 2,


    /**
     * Sets the given @target {Object} during dispatching of the event object.
     */    
    setTarget : function(target) {
      this.__target = target;
    },


    /**
     * {Object} Returns the target on which the event is fired.
     */
    getTarget : function() {
      return this.__target;
    },


    /**
     * Sets the given @currentTarget {Object} during dispatching of the event object.
     */    
    setCurrentTarget : function(currentTarget) {
      this.__currentTarget = currentTarget;
    },


    /**
     * {Object} Returns the current target on which the event is processed.
     */
    getCurrentTarget : function() {
      return this.__currentTarget;
    },


    /**
     * Stop the event propagation
     */
    stopPropagation : function() {
      this.__propagationStopped = true;
    },


    /**
     * {Boolean} Returns whether the propagation was stopped.
     */
    isPropagationStopped : function() {
      return this.__propagationStopped;
    },


    /**
     * Sets the @eventPhase to the given phase. One of:
     *
     * - CAPTURING_PHASE: 1
     * - AT_TARGET: 2
     * - BUBBLING_PHASE: 3
     */
    setEventPhase : function(eventPhase) 
    {
      if (jasy.Env.isSet("debug")) {
        core.Assert.isType(eventPhase, "Integer", "Invalid event phase: %value!");
      }

      this.__eventPhase = eventPhase;
    },


    /**
     * Returns the current event phase
     */
    getEventPhase : function() {
      return this.__eventPhase;
    },


    /**
     * Internal method to reset bubbling state.
     */
    resetDispatch : function() 
    {
      this.__target = null;
      this.__currentTarget = null;
      this.__propagationStopped = false;
      this.__eventPhase = 2;
    }
  }
});
