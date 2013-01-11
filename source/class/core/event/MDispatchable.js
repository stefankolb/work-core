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
    // Interface implementation
    setTarget : function(target) 
    {
      /** #break(core.event.MEventTarget) */
      if (target != null && !core.Class.includesClass(target.constructor, core.event.MEventTarget)) {
        throw new Error("Event targets must include core.event.MEventTarget!");
      }

      this.__target = target;
    },

    // Interface implementation
    getTarget : function() {
      return this.__target;
    }   
  }
});
